"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Store,
  X,
  Tag,
  Calendar,
  CheckCircle2,
  Clock,
  Search,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useGetAllRedeemQuery } from "@/features/redeem/redeemApi";

export default function RedemptionsManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"All Status" | "Pending" | "Used">("All Status");
  const [page, setPage] = useState(1);
  const [selectedRedemption, setSelectedRedemption] = useState<any | null>(null);

  // Formulate status filter parameter for API ("pending" / "used" or "")
  const statusParam = filterMode === "All Status" ? "" : filterMode.toLowerCase();

  // Fetch redemptions from API
  const { data: redeemRes, isLoading, isFetching } = useGetAllRedeemQuery({
    searchTerm: searchQuery,
    page,
    status: statusParam,
  });

  // Fetch overall fixed total redemptions count for card
  const { data: totalRedeemsRes } = useGetAllRedeemQuery({
    searchTerm: "",
    status: "",
    page: 1,
  });

  const redeemList = redeemRes?.data || [];
  const pagination = redeemRes?.pagination || { total: 0, limit: 10, page: 1, totalPage: 1 };
  const totalRedeemCount = totalRedeemsRes?.pagination?.total ?? pagination.total;

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
        {/* Header */}
        <div>
          <h1 className="text-[28px] font-extrabold text-[#111827]">Redemptions History</h1>
          <p className="text-[14px] font-medium text-gray-500 mt-1">Manage and track user activity across all merchant locations in real-time.</p>
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="col-span-1 bg-[#EAECEF] rounded-3xl p-7 flex flex-col gap-3 border border-gray-200/60 min-h-[140px]">
            <div className="flex items-start justify-between">
              <p className="text-[11px] font-extrabold text-gray-500 tracking-widest uppercase">Total Redemptions</p>
              <TrendingUp className="w-5 h-5 text-[#0094DA]" strokeWidth={2.5} />
            </div>
            {isLoading ? (
              <div className="h-10 w-28 bg-gray-300 animate-pulse rounded-md mt-1" />
            ) : (
              <p className="text-[36px] font-extrabold text-[#0094DA] leading-none">
                {totalRedeemCount.toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-[#F0F2F5]/50 border border-gray-200/50 rounded-[28px] p-5 shadow-sm">
          {/* Search Bar & Animated Filter Tabs */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-5">
            <div className="relative w-full max-w-md flex items-center">
              <Search className="absolute left-4 w-4 h-4 text-gray-400 pointer-events-none" strokeWidth={2.5} />
              <input
                type="text"
                placeholder="Search by coupon code or title..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full h-11 pl-11 pr-4 bg-[#E2E4E7] rounded-full text-[13px] font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0094DA]/30 transition-all"
              />
            </div>

            <div className="flex items-center p-1 bg-[#EAECEF] rounded-full relative z-0 shrink-0">
              {(["All Status", "Pending", "Used"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    setFilterMode(mode);
                    setPage(1);
                  }}
                  className={`relative px-6 py-2 rounded-full text-[11px] font-bold transition-colors cursor-pointer z-10 ${
                    filterMode === mode ? "text-gray-800" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {filterMode === mode && (
                    <motion.div
                      layoutId="redemptionFilterBubble"
                      className="absolute inset-0 bg-white rounded-full shadow-sm -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  {mode.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-[20px] overflow-hidden border border-gray-100 relative">
            {(isLoading || isFetching) && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-xs flex items-center justify-center z-30 min-h-[120px]">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 text-[#0094DA] animate-spin" />
                  <p className="text-xs font-semibold text-gray-500">Loading redemptions...</p>
                </div>
              </div>
            )}

            <div className="w-full overflow-x-auto">
              <div className="min-w-[750px]">
                <div className="grid grid-cols-12 px-6 py-4 text-[10px] font-extrabold text-gray-400 tracking-widest uppercase border-b border-gray-100">
                  <div className="col-span-3">User / ID</div>
                  <div className="col-span-3">Merchant</div>
                  <div className="col-span-3">Offer Details</div>
                  <div className="col-span-2">Date</div>
                  <div className="col-span-1">Status</div>
                </div>

                <div className="divide-y divide-gray-100">
                  {redeemList.length === 0 && !isLoading && (
                    <div className="py-12 text-center text-gray-400 text-sm font-medium">
                      No redemptions found.
                    </div>
                  )}

                  {redeemList.map((r: any) => {
                    const coupon = r.coupon || {};
                    const merchantName =
                      coupon.createdBy?.roleRef?.businessName ||
                      `${coupon.createdBy?.firstName || ""} ${coupon.createdBy?.lastName || ""}`.trim() ||
                      "Merchant";
                    const merchantLogo =
                      coupon.createdBy?.roleRef?.logo || coupon.createdBy?.image || "/images/auth/image.png";

                    const userName =
                      typeof r.user === "object"
                        ? `${r.user?.firstName || ""} ${r.user?.lastName || ""}`.trim() || "User"
                        : `User #${r.user ? r.user.slice(-6) : "N/A"}`;
                    const userEmail = typeof r.user === "object" ? r.user?.email : r.user;

                    const isUsed = r.status === "used";

                    return (
                      <div
                        key={r._id}
                        onClick={() => setSelectedRedemption(r)}
                        className="grid grid-cols-12 px-6 py-5 items-center hover:bg-[#F0F7FF] transition-colors cursor-pointer"
                      >
                        <div className="col-span-3 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#D1ECE3] text-[#059669] flex items-center justify-center font-bold text-[12px] flex-shrink-0 uppercase">
                            {userName.charAt(0) || "U"}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-bold text-gray-900 leading-tight truncate">{userName}</p>
                            <p className="text-[11px] text-gray-400 font-medium leading-tight truncate">{userEmail}</p>
                          </div>
                        </div>

                        <div className="col-span-3 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden relative flex-shrink-0 border border-gray-200">
                            <Image src={merchantLogo} alt="Logo" fill unoptimized className="object-cover" />
                          </div>
                          <span className="text-[13px] font-bold text-gray-800 leading-tight truncate">{merchantName}</span>
                        </div>

                        <div className="col-span-3 pr-4">
                          <p className="text-[13px] font-bold text-gray-800 leading-tight truncate">{coupon.title || "Special Offer"}</p>
                          <p className="text-[11px] text-gray-400 font-medium font-mono">Code: {coupon.code || "N/A"} ({coupon.discountPercentage ?? 0}% Off)</p>
                        </div>

                        <div className="col-span-2 text-[12px] text-gray-500 font-medium">{formatDate(r.createdAt)}</div>

                        <div className="col-span-1">
                          <span className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold rounded-full w-fit capitalize ${
                            isUsed ? "bg-[#D1F4D9] text-[#059669]" : "bg-amber-100 text-amber-700"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isUsed ? "bg-[#059669]" : "bg-amber-500"}`} />
                            {r.status || "pending"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Pagination */}
            <div className="bg-[#E6E8EA]/40 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200/50">
              <span className="text-[12px] text-gray-500 font-medium text-center sm:text-left">
                Showing <strong className="font-bold text-gray-700">
                  {pagination.total > 0 ? ((pagination.page - 1) * pagination.limit) + 1 : 0} - {Math.min(pagination.page * pagination.limit, pagination.total)}
                </strong> of {pagination.total.toLocaleString()} redemptions
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  disabled={page <= 1 || isLoading}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm cursor-pointer hover:bg-gray-50 border border-gray-200"
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
                          : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {pNum}
                    </button>
                  ))}

                <button
                  disabled={page >= (pagination.totalPage || 1) || isLoading}
                  onClick={() => setPage((prev) => Math.min(prev + 1, pagination.totalPage || 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm hover:bg-gray-50 border border-gray-200 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Redemption Detail Modal ── */}
      <AnimatePresence>
        {selectedRedemption && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRedemption(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-md border border-gray-100 overflow-hidden z-10"
            >
              <button
                onClick={() => setSelectedRedemption(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer z-10"
              >
                <X className="w-4 h-4 text-gray-600" strokeWidth={2.5} />
              </button>

              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#D1ECE3] text-[#059669] flex items-center justify-center font-bold text-[16px] flex-shrink-0 uppercase">
                    {(typeof selectedRedemption.user === "object"
                      ? selectedRedemption.user?.firstName?.charAt(0)
                      : "U") || "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[16px] font-extrabold text-gray-900 truncate">
                      {typeof selectedRedemption.user === "object"
                        ? `${selectedRedemption.user?.firstName || ""} ${selectedRedemption.user?.lastName || ""}`.trim()
                        : `User #${selectedRedemption.user ? selectedRedemption.user.slice(-6) : "N/A"}`}
                    </p>
                    <p className="text-[12px] text-gray-400 font-medium truncate">
                      {typeof selectedRedemption.user === "object" ? selectedRedemption.user?.email : selectedRedemption.user}
                    </p>
                  </div>
                  <span
                    className={`ml-auto shrink-0 px-3 py-1.5 text-[10px] font-bold rounded-full flex items-center gap-1.5 capitalize ${
                      selectedRedemption.status === "used" ? "bg-[#D1F4D9] text-[#059669]" : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${selectedRedemption.status === "used" ? "bg-[#059669]" : "bg-amber-500"}`} />
                    {selectedRedemption.status}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#EBF5FB] rounded-xl p-4">
                    <Store className="w-5 h-5 text-[#0094DA] mb-2" strokeWidth={2} />
                    <p className="text-[9px] font-extrabold text-gray-400 tracking-widest uppercase">Merchant</p>
                    <p className="text-[13px] font-bold text-gray-900 mt-1 truncate">
                      {selectedRedemption.coupon?.createdBy?.roleRef?.businessName ||
                        `${selectedRedemption.coupon?.createdBy?.firstName || ""} ${selectedRedemption.coupon?.createdBy?.lastName || ""}`.trim() ||
                        "Merchant"}
                    </p>
                  </div>
                  <div className="bg-[#EBF5FB] rounded-xl p-4">
                    <Calendar className="w-5 h-5 text-[#0094DA] mb-2" strokeWidth={2} />
                    <p className="text-[9px] font-extrabold text-gray-400 tracking-widest uppercase">Date</p>
                    <p className="text-[13px] font-bold text-gray-900 mt-1">{formatDate(selectedRedemption.createdAt)}</p>
                  </div>
                  <div className="col-span-2 bg-[#EBF5FB] rounded-xl p-4">
                    <Tag className="w-5 h-5 text-[#0094DA] mb-2" strokeWidth={2} />
                    <p className="text-[9px] font-extrabold text-gray-400 tracking-widest uppercase">Offer Details</p>
                    <p className="text-[14px] font-bold text-gray-900 mt-1">{selectedRedemption.coupon?.title || "Special Offer"}</p>
                    <p className="text-[11px] text-gray-500 font-medium font-mono mt-0.5">
                      Code: {selectedRedemption.coupon?.code || "N/A"} ({selectedRedemption.coupon?.discountPercentage ?? 0}% Off)
                    </p>
                    <p className="text-[11px] text-gray-400 font-medium mt-0.5">Ref: {selectedRedemption.coupon?.uid || "N/A"}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between border border-gray-100">
                  <div className="flex items-center gap-2">
                    {selectedRedemption.status === "used" ? (
                      <CheckCircle2 className="w-5 h-5 text-[#059669]" strokeWidth={2} />
                    ) : (
                      <Clock className="w-5 h-5 text-amber-500" strokeWidth={2} />
                    )}
                    <span className="text-[13px] font-bold text-gray-700 capitalize">Redemption {selectedRedemption.status}</span>
                  </div>
                  <span className="text-[11px] font-bold text-gray-400">{formatDate(selectedRedemption.createdAt)}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
