"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store,
  Search,
  Eye,
  Ban,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle,
  ShieldAlert,
  FileText,
  Maximize2,
  ExternalLink,
  X,
} from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  useGetAllUsersQuery,
  useGetSingleUserQuery,
  useUpdateStatusMutation,
} from "@/features/users/usersApi";

export default function MerchantsManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"All" | "Active" | "Inactive">("All");
  const [page, setPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userToBlock, setUserToBlock] = useState<any | null>(null);
  const [previewLicenseUrl, setPreviewLicenseUrl] = useState<string | null>(null);

  // Formulate status filter parameter
  const statusParam = filterMode === "All" ? "" : filterMode.toLowerCase();

  // Fetch merchants list using usersApi with role="merchant"
  const { data: merchantsRes, isLoading } = useGetAllUsersQuery({
    searchTerm: searchQuery,
    role: "merchant",
    status: statusParam,
    page,
  });

  // Fetch overall fixed total merchants count for card
  const { data: totalMerchantsRes } = useGetAllUsersQuery({
    searchTerm: "",
    role: "merchant",
    status: "",
    page: 1,
  });

  const merchantsList = merchantsRes?.data || [];
  const pagination = merchantsRes?.pagination || { total: 0, limit: 10, page: 1, totalPage: 1 };
  const totalMerchantCount = totalMerchantsRes?.pagination?.total ?? pagination.total;

  // Fetch single merchant detail
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
      toast.success(res?.message || `Merchant status changed to ${newStatus}`);
      setUserToBlock(null);
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || "Failed to update merchant status.");
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
          <h1 className="text-[28px] font-bold text-[#111827]">Merchants Management</h1>
          <p className="text-[14px] font-medium text-gray-500 mt-1">Review, verify and manage merchant registrations across the ecosystem.</p>
        </div>

        {/* Top Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Total Merchants */}
          <div className="col-span-1 bg-[#E6FBFF73] border border-gray-300 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center min-h-[140px]">
            <Store className="absolute right-10 w-36 h-36 text-gray-300 opacity-50" />
            <div className="relative z-10 space-y-2">
              <p className="text-sm font-bold text-[#0094DA] tracking-widest uppercase">Total Merchants</p>
              {isLoading ? (
                <div className="h-9 w-24 bg-gray-200 animate-pulse rounded-md mt-1" />
              ) : (
                <p className="text-[32px] font-bold text-[#111827] leading-none">
                  {totalMerchantCount.toLocaleString()}
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
                placeholder="Search by business, name or email..."
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
                      layoutId="merchantFilterBubble"
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
            {(isLoading) && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-xs flex items-center justify-center z-30 min-h-[120px]">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 text-[#0094DA] animate-spin" />
                  <p className="text-xs font-semibold text-gray-500">Loading merchants...</p>
                </div>
              </div>
            )}

            <div className="w-full overflow-x-auto">
              <div className="min-w-[900px]">
                {/* Table Header */}
                <div className="grid grid-cols-12 bg-gray-100 px-8 py-4 text-[10px] font-bold text-gray-500 tracking-widest uppercase">
                  <div className="col-span-4">Business Details</div>
                  <div className="col-span-2">Business Type</div>
                  <div className="col-span-2">Registration Date</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-gray-100">
                  {merchantsList.length === 0 && !isLoading && (
                    <div className="py-12 text-center text-gray-400 text-sm font-medium">
                      No merchants found.
                    </div>
                  )}

                  {merchantsList.map((merchant: any) => {
                    const businessName = merchant.roleRef?.businessName || `${merchant.firstName || ""} ${merchant.lastName || ""}`.trim() || merchant.uid || "Merchant";
                    const ownerName = `${merchant.firstName || ""} ${merchant.lastName || ""}`.trim();
                    const logoImg = merchant.roleRef?.logo || merchant.image || "/images/auth/image.png";
                    const isMerchantActive = merchant.status === "active";
                    const merchantId = merchant.roleRef?.uid || merchant.uid || "N/A";

                    return (
                      <div key={merchant._id} className="grid grid-cols-12 px-8 py-5 items-center hover:bg-gray-50 transition-colors">
                        <div className="col-span-4 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 relative border border-gray-100">
                            <Image
                              src={logoImg}
                              alt="Logo"
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[14px] font-bold text-gray-900 leading-tight truncate">{businessName}</span>
                            <span className="text-[12px] text-gray-500 font-medium leading-tight truncate">
                              {ownerName ? `Owner: ${ownerName}` : merchant.email}
                            </span>
                            <span className="text-[10px] text-gray-400 font-medium">ID: {merchantId}</span>
                          </div>
                        </div>

                        <div className="col-span-2">
                          <span className="inline-block bg-[#EAECEF] px-3 py-1 rounded-full text-[11px] font-bold text-gray-600 truncate max-w-[120px]">
                            {merchant.roleRef?.businessType || "General"}
                          </span>
                        </div>

                        <div className="col-span-2 text-[13px] text-gray-600 font-medium">
                          {formatDate(merchant.createdAt)}
                        </div>

                        <div className="col-span-2">
                          <span className={`px-3 py-1 text-[11px] font-bold rounded-full capitalize ${
                            isMerchantActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}>
                            {merchant.status || "inactive"}
                          </span>
                        </div>

                        <div className="col-span-2 flex items-center justify-end gap-3 cursor-pointer">
                          <button
                            onClick={() => setSelectedUserId(merchant._id)}
                            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" strokeWidth={2} />
                          </button>
                          <button
                            onClick={() => setUserToBlock(merchant)}
                            className={`transition-colors cursor-pointer ${
                              isMerchantActive ? "text-red-400 hover:text-red-600" : "text-emerald-500 hover:text-emerald-700"
                            }`}
                            title={isMerchantActive ? "Deactivate Merchant" : "Activate Merchant"}
                          >
                            {isMerchantActive ? <Ban className="w-5 h-5" strokeWidth={2} /> : <CheckCircle className="w-5 h-5" strokeWidth={2} />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Pagination footer */}
            <div className="bg-gray-100 px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200/50">
              <span className="text-[12px] text-gray-500 font-medium text-center sm:text-left">
                Showing <strong className="font-bold text-gray-700">
                  {pagination.total > 0 ? ((pagination.page - 1) * pagination.limit) + 1 : 0} - {Math.min(pagination.page * pagination.limit, pagination.total)}
                </strong> of {pagination.total.toLocaleString()} merchants
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

        {/* Merchant Detail Modal */}
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
                className="relative bg-[#F4F4F4] rounded-[24px] shadow-2xl w-full max-w-2xl overflow-hidden p-8 py-6 border border-white max-h-[90vh] overflow-y-auto z-10"
              >
                {isSingleLoading ? (
                  <div className="py-16 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 text-[#0094DA] animate-spin" />
                    <p className="text-sm font-semibold text-gray-500">Loading merchant details...</p>
                  </div>
                ) : singleUser ? (
                  <>
                    {/* Modal Info Header */}
                    <div className="bg-[#EFEEED] border border-[#0094DA]/30 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center gap-6 relative">
                      <div className="flex items-center gap-4 w-full">
                        <div className="w-16 h-16 rounded-full bg-gray-300 relative overflow-hidden flex-shrink-0 border border-gray-200">
                          <Image
                            src={singleUser.roleRef?.logo || singleUser.image || "/images/auth/image.png"}
                            alt="Logo"
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[18px] font-bold text-gray-900 leading-tight">
                              {singleUser.roleRef?.businessName || `${singleUser.firstName || ""} ${singleUser.lastName || ""}`}
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
                          <span className="text-[12px] text-gray-600 font-medium mt-0.5">
                            Owner: {singleUser.firstName} {singleUser.lastName} ({singleUser.email})
                          </span>
                          <span className="text-[11px] text-gray-400 font-medium mt-0.5">
                            MID: {singleUser.roleRef?.uid || singleUser.uid || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Business Information Grid */}
                    <div className="mt-6 bg-white p-5 rounded-xl border border-gray-200/60 space-y-4">
                      <p className="text-[11px] font-extrabold text-gray-500 tracking-widest uppercase">Business Information</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Business Type</p>
                          <p className="font-semibold text-gray-800 mt-0.5">{singleUser.roleRef?.businessType || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Phone Number</p>
                          <p className="font-semibold text-gray-800 mt-0.5">
                            {singleUser.roleRef?.phone?.countryCode || singleUser.phone?.countryCode || ""} {singleUser.roleRef?.phone?.number || singleUser.phone?.number || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">KYC Status</p>
                          <p className="font-semibold text-gray-800 mt-0.5 capitalize">
                            {singleUser.roleRef?.kycStatus || "Pending"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Registered Date</p>
                          <p className="font-semibold text-gray-800 mt-0.5">{formatDate(singleUser.createdAt)}</p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-100 text-xs">
                        <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Business Address</p>
                        <p className="font-semibold text-gray-800 mt-0.5">{singleUser.roleRef?.address || singleUser.address || "No address specified"}</p>
                      </div>

                      {singleUser.roleRef?.businessDescription && (
                        <div className="pt-3 border-t border-gray-100 text-xs">
                          <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Description</p>
                          <p className="text-gray-700 font-medium mt-0.5 leading-relaxed">{singleUser.roleRef.businessDescription}</p>
                        </div>
                      )}

                      {/* Trade License Image Preview */}
                      {singleUser.roleRef?.tradeLicense && (
                        <div className="pt-3 border-t border-gray-100">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[11px] font-bold text-[#0094DA] flex items-center gap-1">
                              <FileText className="w-3.5 h-3.5" /> Trade License Document
                            </p>
                            <button
                              type="button"
                              onClick={() => setPreviewLicenseUrl(singleUser.roleRef.tradeLicense)}
                              className="text-[11px] font-bold text-[#0094DA] hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Maximize2 className="w-3 h-3" /> Click to expand
                            </button>
                          </div>
                          <div
                            onClick={() => setPreviewLicenseUrl(singleUser.roleRef.tradeLicense)}
                            className="relative w-48 h-32 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 cursor-pointer group hover:border-[#0094DA] transition-all shadow-xs"
                          >
                            <Image
                              src={singleUser.roleRef.tradeLicense}
                              alt="Trade License"
                              fill
                              unoptimized
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1">
                              <Maximize2 className="w-5 h-5" />
                              <span className="text-[10px] font-bold">View Full Document</span>
                            </div>
                          </div>
                        </div>
                      )}
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
                  <div className="py-12 text-center text-gray-500 font-medium">Failed to load merchant details.</div>
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
                  {userToBlock.status === "active" ? "Deactivate Merchant?" : "Activate Merchant?"}
                </h3>
                <p className="text-[14px] text-gray-500 font-medium mb-8">
                  Are you sure you want to change status for{" "}
                  <span className="font-bold text-gray-700">
                    {userToBlock.roleRef?.businessName || `${userToBlock.firstName} ${userToBlock.lastName}`}
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

        {/* ── Trade License Document Full Screen Preview Modal ── */}
        <AnimatePresence>
          {previewLicenseUrl && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setPreviewLicenseUrl(null)}
                className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-gray-100 p-6 flex flex-col overflow-hidden z-10 max-h-[90vh]"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#0094DA]/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-[#0094DA]" />
                    </div>
                    <div>
                      <h3 className="text-[16px] font-bold text-gray-900 leading-tight">Trade License Document</h3>
                      <p className="text-[11px] text-gray-400 font-medium">Merchant Legal Verification Document</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={previewLicenseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-gray-600 hover:text-[#0094DA] hover:bg-gray-100 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 text-[12px] font-bold border border-gray-200"
                      title="Open in new tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Open Original</span>
                    </a>
                    <button
                      onClick={() => setPreviewLicenseUrl(null)}
                      className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
                    >
                      <X className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>

                {/* Large Image Preview Container */}
                <div className="relative w-full flex-1 min-h-[350px] max-h-[68vh] bg-gray-900 rounded-xl overflow-hidden flex items-center justify-center p-2 border border-gray-800">
                  <Image
                    src={previewLicenseUrl}
                    alt="Trade License Document Full Preview"
                    fill
                    unoptimized
                    className="object-contain"
                  />
                </div>

                {/* Modal Footer */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setPreviewLicenseUrl(null)}
                    className="px-6 py-2.5 rounded-xl bg-gray-900 text-white font-bold text-[13px] hover:bg-gray-800 transition-colors cursor-pointer shadow-sm"
                  >
                    Close Preview
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
