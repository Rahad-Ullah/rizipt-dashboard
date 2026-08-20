"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Eye, Ban, ChevronLeft, ChevronRight, Users, Loader2, CheckCircle, ShieldAlert } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  useGetAllUsersQuery,
  useGetSingleUserQuery,
  useUpdateStatusMutation,
} from "@/features/users/usersApi";

export default function UsersManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"All" | "Active" | "Inactive">("All");
  const [page, setPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userToBlock, setUserToBlock] = useState<any | null>(null);

  // Formulate status filter parameter
  const statusParam = filterMode === "All" ? "" : filterMode.toLowerCase();

  // Fetch users list
  const { data: usersRes, isLoading, isFetching } = useGetAllUsersQuery({
    searchTerm: searchQuery,
    role: "user",
    status: statusParam,
    page,
  });

  // Fetch overall fixed total users count for card
  const { data: totalUsersRes } = useGetAllUsersQuery({
    searchTerm: "",
    role: "user",
    status: "",
    page: 1,
  });

  const usersList = usersRes?.data || [];
  const pagination = usersRes?.pagination || { total: 0, limit: 10, page: 1, totalPage: 1 };
  const totalUserCount = totalUsersRes?.pagination?.total ?? pagination.total;

  // Fetch single user detail
  const { data: singleUserRes, isLoading: isSingleLoading } = useGetSingleUserQuery(
    selectedUserId,
    { skip: !selectedUserId }
  );
  const singleUser = singleUserRes?.data;

  // Status update mutation
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateStatusMutation();

  const handleToggleStatus = async () => {
    if (!userToBlock) return;
    const newStatus = userToBlock.status === "active" ? "inactive" : "active";
    try {
      const res = await updateStatus({ id: userToBlock._id, status: newStatus }).unwrap();
      toast.success(res?.message || `User status changed to ${newStatus}`);
      setUserToBlock(null);
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || "Failed to update user status.");
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="w-full py-6 pb-10">
      <div className="w-full flex flex-col gap-6">

        {/* Header Texts */}
        <div className="mb-2">
          <h1 className="text-[28px] font-bold text-[#111827]">User Management</h1>
          <p className="text-[14px] font-medium text-gray-500 mt-1">Monitor and manage access for all observatory personnel and participants.</p>
        </div>

        {/* Top Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Total Users */}
          <div className="col-span-1 bg-[#E6FBFF73] border border-gray-300 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center min-h-[140px]">
            <Users className="absolute right-10 w-36 h-36 text-gray-300 opacity-50" />
            <div className="relative z-10 space-y-2">
              <p className="text-sm font-bold text-[#0094DA] tracking-widest uppercase">Total Users</p>
              {isLoading ? (
                <div className="h-9 w-24 bg-gray-200 animate-pulse rounded-md mt-1" />
              ) : (
                <p className="text-[32px] font-bold text-[#111827] leading-none">
                  {totalUserCount.toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-[#EAECEF] rounded-[24px] p-2 md:p-3 mt-2">
          <div className="w-full flex flex-col lg:flex-row justify-between items-center px-2 sm:px-4 py-3 gap-4">
            <div className="relative w-full max-w-md flex items-center">
              <Search className="absolute left-4 w-4 h-4 text-gray-400 pointer-events-none" strokeWidth={2.5} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full h-11 pl-11 pr-4 bg-[#E2E4E7] rounded-full text-[13px] font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0094DA]/30 transition-all"
              />
            </div>

            <div className="flex items-center p-1 bg-[#E2E4E7] rounded-full relative z-0 overflow-x-auto max-w-full">
              {(["All", "Active", "Inactive"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    setFilterMode(mode);
                    setPage(1);
                  }}
                  className={`relative px-4 sm:px-6 py-1.5 rounded-full text-[12px] font-bold transition-colors cursor-pointer z-10 whitespace-nowrap ${
                    filterMode === mode ? "text-gray-800" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {filterMode === mode && (
                    <motion.div
                      layoutId="userFilterBubble"
                      className="absolute inset-0 bg-white rounded-full shadow-sm -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[24px] mt-4 shadow-sm border border-gray-100 overflow-hidden relative">
            {(isLoading || isFetching) && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-xs flex items-center justify-center z-30 min-h-[120px]">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 text-[#0094DA] animate-spin" />
                  <p className="text-xs font-semibold text-gray-500">Loading users...</p>
                </div>
              </div>
            )}

            <div className="w-full overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Table Header */}
                <div className="grid grid-cols-12 bg-[#E6E8EA] px-8 py-4 text-[10px] font-bold text-gray-500 tracking-widest uppercase">
                  <div className="col-span-4">User Details</div>
                  <div className="col-span-3">Joined Date</div>
                  <div className="col-span-2">UID</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-gray-100">
                  {usersList.length === 0 && !isLoading && (
                    <div className="py-12 text-center text-gray-400 text-sm font-medium">
                      No users found.
                    </div>
                  )}

                  {usersList.map((user: any) => {
                    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.uid || "User";
                    const isUserActive = user.status === "active";

                    return (
                      <div key={user._id} className="grid grid-cols-12 px-8 py-5 items-center hover:bg-gray-50 transition-colors">
                        <div className="col-span-4 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 relative">
                            <Image
                              src={user.image || "/images/auth/image.png"}
                              alt="Avatar"
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[13px] font-bold text-gray-900 leading-tight">{fullName}</span>
                            <span className="text-[12px] text-gray-500 font-medium leading-tight">{user.email}</span>
                          </div>
                        </div>
                        <div className="col-span-3 text-[13px] text-gray-600 font-medium">
                          {formatDate(user.createdAt)}
                        </div>
                        <div className="col-span-2 text-[13px] font-bold text-gray-800">
                          {user.uid || "N/A"}
                        </div>
                        <div className="col-span-2">
                          <span className={`px-3 py-1 text-[11px] font-bold rounded-full capitalize ${
                            isUserActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}>
                            {user.status || "inactive"}
                          </span>
                        </div>
                        <div className="col-span-1 flex items-center justify-end gap-3 cursor-pointer">
                          <button
                            onClick={() => setSelectedUserId(user._id)}
                            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" strokeWidth={2} />
                          </button>
                          <button
                            onClick={() => setUserToBlock(user)}
                            className={`transition-colors cursor-pointer ${
                              isUserActive ? "text-red-400 hover:text-red-600" : "text-emerald-500 hover:text-emerald-700"
                            }`}
                            title={isUserActive ? "Deactivate / Block User" : "Activate User"}
                          >
                            {isUserActive ? <Ban className="w-5 h-5" strokeWidth={2} /> : <CheckCircle className="w-5 h-5" strokeWidth={2} />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Pagination footer */}
            <div className="bg-[#E6E8EA] px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200/50">
              <span className="text-[12px] text-gray-500 font-medium text-center sm:text-left">
                Showing <strong className="font-bold text-gray-700">
                  {pagination.total > 0 ? ((pagination.page - 1) * pagination.limit) + 1 : 0} - {Math.min(pagination.page * pagination.limit, pagination.total)}
                </strong> of {pagination.total.toLocaleString()} users
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  disabled={page <= 1 || isLoading}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm cursor-pointer hover:bg-gray-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: pagination.totalPage || 1 }, (_, i) => i + 1)
                  .slice(0, 5)
                  .map((pNum) => (
                    <button
                      key={pNum}
                      onClick={() => setPage(pNum)}
                      className={`w-8 h-8 flex items-center justify-center rounded-full text-[12px] font-bold shadow-sm cursor-pointer ${
                        page === pNum
                          ? "bg-[#0094DA] text-white"
                          : "bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {pNum}
                    </button>
                  ))}

                <button
                  disabled={page >= (pagination.totalPage || 1) || isLoading}
                  onClick={() => setPage((prev) => Math.min(prev + 1, pagination.totalPage || 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm hover:bg-gray-50 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* User Detail Modal */}
        <AnimatePresence>
          {selectedUserId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedUserId(null)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative bg-[#F4F4F4] rounded-xl shadow-2xl w-full max-w-xl overflow-hidden p-8 py-6 border border-white z-10"
              >
                {isSingleLoading ? (
                  <div className="py-16 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 text-[#0094DA] animate-spin" />
                    <p className="text-sm font-semibold text-gray-500">Loading user details...</p>
                  </div>
                ) : singleUser ? (
                  <>
                    {/* Modal Info Bar */}
                    <div className="bg-[#EFEEED] border border-[#0094DA]/30 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center gap-6 relative">
                      <div className="flex items-center gap-4 w-full">
                        <div className="w-16 h-16 rounded-full bg-gray-300 relative overflow-hidden flex-shrink-0">
                          <Image
                            src={singleUser.image || "/images/auth/image.png"}
                            alt="Avatar"
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-[16px] font-bold text-gray-900 leading-tight">
                              {singleUser.firstName} {singleUser.lastName}
                            </span>
                            <span
                              className={`px-2.5 py-0.5 leading-tight text-[10px] font-bold rounded-full capitalize ${
                                singleUser.status === "active"
                                  ? "bg-green-200/60 text-green-800"
                                  : "bg-red-200/60 text-red-800"
                              }`}
                            >
                              {singleUser.status}
                            </span>
                          </div>
                          <span className="text-[12px] text-gray-600 font-medium mt-0.5">{singleUser.email}</span>
                          <span className="text-[11px] text-gray-400 font-medium mt-0.5">
                            UID: {singleUser.uid || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Info Grid */}
                    <div className="mt-6 bg-white p-5 rounded-xl border border-gray-200/60 space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Phone Number</p>
                          <p className="font-semibold text-gray-800 mt-0.5">
                            {singleUser.phone?.countryCode || ""} {singleUser.phone?.number || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Email Verification</p>
                          <p className="font-semibold text-gray-800 mt-0.5">
                            {singleUser.isEmailVerified ? "Verified" : "Unverified"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Joined Date</p>
                          <p className="font-semibold text-gray-800 mt-0.5">{formatDate(singleUser.createdAt)}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Role</p>
                          <p className="font-semibold text-gray-800 mt-0.5 capitalize">{singleUser.role || "User"}</p>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-gray-100 text-xs">
                        <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Address</p>
                        <p className="font-semibold text-gray-800 mt-0.5">{singleUser.address || "No address specified"}</p>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3 w-full">
                      <button
                        onClick={() => setSelectedUserId(null)}
                        className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#EAECEF] text-gray-700 font-bold text-[13px] hover:bg-gray-300 transition-colors shadow-sm cursor-pointer"
                      >
                        Close
                      </button>
                      <button
                        onClick={() => {
                          setUserToBlock(singleUser);
                        }}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-[13px] transition-colors shadow-sm cursor-pointer ${
                          singleUser.status === "active"
                            ? "bg-[#D92D20] hover:bg-[#B42217] text-white"
                            : "bg-emerald-600 hover:bg-emerald-700 text-white"
                        }`}
                      >
                        {singleUser.status === "active" ? (
                          <>
                            <Ban className="w-4 h-4" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Activate
                          </>
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="py-12 text-center text-gray-500 font-medium">Failed to load user details.</div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Status Update Confirmation Modal */}
        <AnimatePresence>
          {userToBlock && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setUserToBlock(null)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden p-8 flex flex-col items-center text-center border border-gray-100 z-10"
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${
                  userToBlock.status === "active" ? "bg-red-50 text-[#D92D20]" : "bg-emerald-50 text-emerald-600"
                }`}>
                  {userToBlock.status === "active" ? <ShieldAlert className="w-8 h-8" /> : <CheckCircle className="w-8 h-8" />}
                </div>
                
                <h3 className="text-[20px] font-bold text-gray-900 mb-2">
                  {userToBlock.status === "active" ? "Deactivate User?" : "Activate User?"}
                </h3>
                <p className="text-[14px] text-gray-500 font-medium mb-8">
                  Are you sure you want to change status for{" "}
                  <span className="font-bold text-gray-700">
                    {userToBlock.firstName} {userToBlock.lastName}
                  </span>{" "}
                  to <strong className="uppercase">{userToBlock.status === "active" ? "inactive" : "active"}</strong>?
                </p>

                <div className="flex gap-3 w-full">
                  <button
                    disabled={isUpdatingStatus}
                    onClick={() => setUserToBlock(null)}
                    className="flex-1 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-[14px] hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isUpdatingStatus}
                    onClick={handleToggleStatus}
                    className={`flex-1 px-6 py-3 rounded-xl text-white font-bold text-[14px] transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                      userToBlock.status === "active"
                        ? "bg-[#D92D20] hover:bg-[#B42217] shadow-red-200"
                        : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                    }`}
                  >
                    {isUpdatingStatus ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Confirm"
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}