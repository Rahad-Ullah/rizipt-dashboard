"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, X, Phone, MapPin, Loader2 } from "lucide-react";
import Image from "next/image";
import { useGetAllReceiptsQuery } from "@/features/receipts/receiptsApi";

export default function ReceiptsManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"All" | "Draft" | "Sent">("All");
  const [page, setPage] = useState(1);
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);

  // Formulate status parameter for API ("draft" / "sent" or "")
  const statusParam = filterMode === "All" ? "" : filterMode.toLowerCase();

  // Fetch receipts from API
  const { data: receiptsRes, isLoading, isFetching } = useGetAllReceiptsQuery({
    searchTerm: searchQuery,
    page,
    status: statusParam,
  });

  // Fetch overall fixed total receipts count for card
  const { data: totalReceiptsRes } = useGetAllReceiptsQuery({
    searchTerm: "",
    status: "",
    page: 1,
  });

  const receiptsList = receiptsRes?.data || [];
  const pagination = receiptsRes?.pagination || { total: 0, limit: 10, page: 1, totalPage: 1 };
  const totalReceiptCount = totalReceiptsRes?.pagination?.total ?? pagination.total;

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

  const formatFullDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      const datePart = d.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }).toUpperCase();
      const timePart = d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return `${datePart} - ${timePart}`;
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="w-full py-6 pb-10">
      <div className="w-full flex flex-col gap-6">

        {/* Header */}
        <div>
          <h1 className="text-[28px] font-extrabold text-[#111827]">Receipts Management</h1>
          <p className="text-[14px] font-medium text-gray-500 mt-1">Review transaction proof documents and processed receipts.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="col-span-1 bg-[#E6FBFF73] border border-gray-300 rounded-3xl p-7 flex flex-col justify-center min-h-[130px]">
            <span className="text-xs font-bold tracking-widest text-[#0094DA] uppercase">Total Receipts</span>
            {isLoading ? (
              <div className="h-9 w-24 bg-gray-200 animate-pulse rounded-md mt-1" />
            ) : (
              <span className="text-[36px] font-extrabold leading-none text-[#111827] mt-1">
                {totalReceiptCount.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-[#F0F2F5]/50 border border-gray-200/50 rounded-[28px] p-5 shadow-sm">
          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4 px-2">
            <div className="relative w-full max-w-md flex items-center">
              <Search className="absolute left-4 w-4 h-4 text-gray-400 pointer-events-none" strokeWidth={2.5} />
              <input
                type="text"
                placeholder="Search by title, reference, or merchant..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full h-11 pl-11 pr-4 bg-[#E2E4E7] rounded-full text-[13px] font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0094DA]/30 transition-all"
              />
            </div>

            {/* Animated Filter Tabs */}
            <div className="flex items-center p-1 bg-[#EAECEF] rounded-full shrink-0 relative z-0">
              {(["All", "Draft", "Sent"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    setFilterMode(mode);
                    setPage(1);
                  }}
                  className={`relative px-5 py-1.5 rounded-full text-[12px] font-bold transition-colors cursor-pointer z-10 ${
                    filterMode === mode ? "text-gray-800" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {filterMode === mode && (
                    <motion.div
                      layoutId="receiptFilterBubble"
                      className="absolute inset-0 bg-white rounded-full shadow-sm -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-[20px] overflow-hidden border border-gray-100 relative">
            {(isLoading || isFetching) && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-xs flex items-center justify-center z-30 min-h-[120px]">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 text-[#0094DA] animate-spin" />
                  <p className="text-xs font-semibold text-gray-500">Loading receipts...</p>
                </div>
              </div>
            )}

            <div className="w-full overflow-x-auto">
              <div className="min-w-[850px]">
                {/* Table Header */}
                <div className="grid grid-cols-12 bg-[#E6E8EA] px-6 py-4 text-[10px] font-extrabold text-gray-500 tracking-widest uppercase">
                  <div className="col-span-2">Receipt ID</div>
                  <div className="col-span-3">Customer</div>
                  <div className="col-span-3">Merchant</div>
                  <div className="col-span-2">Total Amount</div>
                  <div className="col-span-1">Date</div>
                  <div className="col-span-1 text-right">Status</div>
                </div>

                {/* Table Rows – clickable */}
                <div className="divide-y divide-gray-100">
                  {receiptsList.length === 0 && !isLoading && (
                    <div className="py-12 text-center text-gray-400 text-sm font-medium">
                      No receipts found.
                    </div>
                  )}

                  {receiptsList.map((r: any) => {
                    const receiptId = r.uid || r.reference || r._id.slice(-6);
                    const customerName = r.customer?.name || "N/A";
                    const customerEmail = r.customer?.email || "";
                    const merchantName = r.merchant?.businessName || "General Merchant";
                    const totalAmt = typeof r.total === "number" ? `$${r.total.toFixed(2)}` : "$0.00";
                    const isSent = r.status === "sent";

                    return (
                      <div
                        key={r._id}
                        onClick={() => setSelectedReceipt(r)}
                        className="grid grid-cols-12 px-6 py-4 items-center hover:bg-[#F0F7FF] transition-colors cursor-pointer"
                      >
                        <div className="col-span-2 text-[13px] font-bold text-gray-700 truncate">{receiptId}</div>

                        <div className="col-span-3 flex items-center gap-2 pr-2">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-xs shrink-0">
                            {customerName !== "N/A" ? customerName.charAt(0).toUpperCase() : "C"}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-bold text-gray-900 leading-tight truncate">{customerName}</p>
                            {customerEmail && (
                              <p className="text-[11px] text-gray-400 leading-tight truncate">{customerEmail}</p>
                            )}
                          </div>
                        </div>

                        <div className="col-span-3 text-[13px] text-gray-600 font-medium pr-4 truncate">{merchantName}</div>
                        <div className="col-span-2 text-[13px] font-bold text-[#0094DA]">{totalAmt}</div>
                        <div className="col-span-1 text-[12px] text-gray-500 font-medium leading-tight">{formatDate(r.createdAt)}</div>

                        <div className="col-span-1 flex justify-end">
                          <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg tracking-wider uppercase capitalize ${
                            isSent ? "bg-[#D1F4D9] text-[#059669]" : "bg-[#FDF0D5] text-[#D97706]"
                          }`}>
                            {r.status || "draft"}
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
                </strong> of {pagination.total.toLocaleString()} receipts
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
      </div>

      {/* ── Receipt Detail Modal ── */}
      <AnimatePresence>
        {selectedReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReceipt(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative bg-white rounded-[20px] shadow-2xl w-full max-w-lg border border-gray-100 overflow-hidden max-h-[90vh] overflow-y-auto z-10"
            >
              {/* Close */}
              <button
                onClick={() => setSelectedReceipt(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer z-10"
              >
                <X className="w-4 h-4 text-gray-600" strokeWidth={2.5} />
              </button>

              {/* Modal Header – Merchant + Customer */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 p-5 pb-4 border-b border-gray-100">
                {/* Merchant */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#D6EBF8] flex items-center justify-center font-bold text-[#0094DA] text-[14px] flex-shrink-0">
                    {(selectedReceipt.merchant?.businessName || "M").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-gray-900 leading-tight">
                      {selectedReceipt.merchant?.businessName || "Merchant"}
                    </p>
                    {selectedReceipt.merchant?.phone && (
                      <p className="text-[11px] text-gray-500 font-medium flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" /> {selectedReceipt.merchant.phone}
                      </p>
                    )}
                    {selectedReceipt.merchant?.address && (
                      <p className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {selectedReceipt.merchant.address}
                      </p>
                    )}
                  </div>
                </div>

                {/* Customer */}
                {selectedReceipt.customer && (
                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2.5 shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-xs shrink-0">
                      {selectedReceipt.customer.name?.charAt(0).toUpperCase() || "C"}
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-gray-900 leading-tight">{selectedReceipt.customer.name}</p>
                      <p className="text-[11px] text-gray-400 font-medium">{selectedReceipt.customer.email}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Amount Hero */}
              <div className="text-center py-6 px-5 relative bg-gray-50/50">
                <span className={`absolute top-4 right-5 text-[10px] font-extrabold tracking-widest px-3 py-1 rounded-full uppercase ${
                  selectedReceipt.status === "sent" ? "bg-[#D1F4D9] text-[#059669]" : "bg-[#FDF0D5] text-[#D97706]"
                }`}>
                  {selectedReceipt.status || "draft"}
                </span>
                <p className="text-[32px] font-bold text-gray-900">
                  ${selectedReceipt.total?.toFixed(2) ?? "0.00"}
                </p>
                <p className="text-[11px] font-bold text-gray-400 tracking-widest mt-1 uppercase">
                  {selectedReceipt.title || "TRANSACTION RECEIPT"}
                </p>
                <p className="text-[12px] text-gray-500 font-medium mt-2">{formatFullDate(selectedReceipt.createdAt)}</p>
                <p className="text-[11px] text-gray-400 font-bold mt-0.5">
                  ID: {selectedReceipt.uid || selectedReceipt.reference || selectedReceipt._id}
                </p>
              </div>

              {/* Image preview if exists */}
              {selectedReceipt.image && (
                <div className="px-5 py-3 border-t border-gray-100">
                  <p className="text-[10px] font-extrabold text-gray-400 tracking-widest uppercase mb-2">Scanned Image</p>
                  <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                    <Image
                      src={selectedReceipt.image}
                      alt="Receipt Document"
                      fill
                      unoptimized
                      className="object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Purchase Breakdown */}
              <div className="px-5 pb-5 pt-3">
                <p className="text-[10px] font-extrabold text-gray-400 tracking-widest uppercase mb-3">Purchase Breakdown</p>
                <div className="space-y-3">
                  {(selectedReceipt.lineItems || []).map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-start gap-4 text-xs">
                      <div>
                        <p className="font-bold text-gray-800 leading-tight">{item.name}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-gray-800">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                        <p className="text-[10px] text-gray-400 font-medium">Qty: {item.quantity} x ${item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 mt-4 pt-3 space-y-1.5">
                  <div className="flex justify-between text-[12px] text-gray-500 font-medium">
                    <span>Subtotal</span>
                    <span>${selectedReceipt.subtotal?.toFixed(2) ?? "0.00"}</span>
                  </div>
                  <div className="flex justify-between text-[12px] text-gray-500 font-medium">
                    <span>Tax ({selectedReceipt.taxPercentage ?? 0}%)</span>
                    <span>${selectedReceipt.taxAmount?.toFixed(2) ?? "0.00"}</span>
                  </div>
                  <div className="flex justify-between text-[15px] font-bold text-gray-900 pt-2 border-t border-gray-100 mt-2">
                    <span>Total Paid</span>
                    <span>${selectedReceipt.total?.toFixed(2) ?? "0.00"}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
