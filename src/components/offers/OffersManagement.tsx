"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Calendar,
  CheckCheck,
  Percent,
  Store,
  Trash2,
  Loader2,
  Ticket,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  useGetAllOffersQuery,
  useDeleteOffersMutation,
} from "@/features/offer/offerApi";

function OfferCard({
  offer,
  onDeleteClick,
}: {
  offer: any;
  onDeleteClick: (offer: any) => void;
}) {
  const isActive = offer.status === "active";
  const merchantName =
    offer.createdBy?.roleRef?.businessName ||
    `${offer.createdBy?.firstName || ""} ${offer.createdBy?.lastName || ""}`.trim() ||
    "Merchant";
  const merchantCategory = offer.createdBy?.roleRef?.businessType || "General";
  const merchantLogo =
    offer.createdBy?.roleRef?.logo || offer.createdBy?.image || "/images/auth/image.png";

  // Calculate days remaining
  const calculateDaysLeft = (expiresAtStr: string) => {
    if (!expiresAtStr) return "N/A";
    const diff = new Date(expiresAtStr).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return "Expired";
    if (days === 0) return "Today";
    return `${days} Days`;
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
    <div className="bg-white rounded-[20px] overflow-hidden border border-gray-200/60 shadow-sm hover:shadow-md transition-shadow flex flex-col relative group">
      {/* Delete Button */}
      <button
        onClick={() => onDeleteClick(offer)}
        className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-red-50 text-gray-500 hover:text-red-600 flex items-center justify-center shadow-md transition-colors cursor-pointer"
        title="Delete Offer"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Card Image / Hero */}
      <div className="relative h-[160px] overflow-hidden bg-slate-800">
        {offer.image ? (
          <Image
            src={offer.image}
            alt={offer.title || "Offer Banner"}
            fill
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-700 opacity-90" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Status badge */}
        <div
          className={`absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-[10px] font-bold tracking-wider uppercase backdrop-blur-md ${
            isActive ? "bg-emerald-600/90" : "bg-gray-600/90"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          {offer.status || "inactive"}
        </div>

        {/* Merchant info + Ends in badge */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md overflow-hidden relative flex-shrink-0 border border-white">
              {merchantLogo ? (
                <Image src={merchantLogo} alt="Logo" fill unoptimized className="object-cover" />
              ) : (
                <Store className="w-5 h-5 text-gray-600" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold text-[14px] leading-tight drop-shadow truncate">
                {merchantName}
              </p>
              <p className="text-white/80 text-[11px] font-medium drop-shadow truncate">
                {merchantCategory}
              </p>
            </div>
          </div>

          <div className="bg-[#E11D48] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md whitespace-nowrap shrink-0">
            Ends in {calculateDaysLeft(offer.expiresAt)}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col gap-3 flex-1 justify-between">
        <div className="space-y-3">
          {/* Code & Redeemed count */}
          <div className="flex items-center justify-between text-[12px] text-gray-600 font-medium">
            <span className="flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold text-gray-800">
              <Ticket className="w-3.5 h-3.5 text-[#0094DA]" />
              {offer.code || "NO CODE"}
            </span>

            <span className="flex items-center gap-1 text-[11px] font-bold text-gray-500">
              <CheckCheck className="w-3.5 h-3.5 text-[#0094DA]" />
              {offer.redeemCount ?? 0} Redeemed
            </span>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#EBF5FB] rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Percent className="w-4 h-4 text-[#0094DA]" strokeWidth={2.5} />
              </div>
              <p className="text-[9px] font-extrabold text-gray-400 tracking-widest uppercase">
                Discount
              </p>
              <p className="text-[13px] font-bold text-gray-800 mt-0.5">
                {offer.discountPercentage ?? 0}% Off
              </p>
            </div>
            <div className="bg-[#EBF5FB] rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Calendar className="w-4 h-4 text-[#0094DA]" strokeWidth={2.5} />
              </div>
              <p className="text-[9px] font-extrabold text-gray-400 tracking-widest uppercase">
                Expiry Date
              </p>
              <p className="text-[13px] font-bold text-gray-800 mt-0.5">
                {formatDate(offer.expiresAt)}
              </p>
            </div>
          </div>

          {/* Offer description */}
          <div className="mt-1">
            <p className="text-[13px] font-bold text-[#0094DA] leading-snug">{offer.title}</p>
            <p className="text-[12px] text-gray-500 font-medium mt-0.5 line-clamp-2 leading-relaxed">
              {offer.description}
            </p>
          </div>
        </div>

        {/* Footer UID */}
        <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400">
          <span>UID: {offer.uid || "N/A"}</span>
          <span className="capitalize text-gray-500 font-medium">{offer.status}</span>
        </div>
      </div>
    </div>
  );
}

export default function OffersManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"All" | "Active" | "Expired">("All");
  const [page, setPage] = useState(1);
  const [offerToDelete, setOfferToDelete] = useState<any | null>(null);

  const statusParam = filterMode === "All" ? "" : filterMode.toLowerCase();

  // Fetch offers list
  const { data: offersRes, isLoading, isFetching } = useGetAllOffersQuery({
    searchTerm: searchQuery,
    status: statusParam,
    page,
  });

  const offersList = offersRes?.data || [];
  const pagination = offersRes?.pagination || { total: 0, limit: 10, page: 1, totalPage: 1 };

  // Delete offer mutation
  const [deleteOffers, { isLoading: isDeleting }] = useDeleteOffersMutation();

  const handleDeleteOffer = async () => {
    if (!offerToDelete) return;
    try {
      const res = await deleteOffers(offerToDelete._id).unwrap();
      toast.success(res?.message || "Offer deleted successfully");
      setOfferToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || "Failed to delete offer");
    }
  };

  return (
    <div className="w-full py-6 pb-10">
      <div className="w-full flex flex-col gap-6">

        {/* Header */}
        <div>
          <h1 className="text-[28px] font-extrabold text-[#111827]">Offer Management</h1>
          <p className="text-[14px] font-medium text-gray-500 mt-1">Review offers of all merchants across the ecosystem.</p>
        </div>

        {/* Search & Filter Container */}
        <div className="bg-[#EAECEF] rounded-[24px] px-5 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full max-w-md flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-gray-400 pointer-events-none" strokeWidth={2.5} />
            <input
              type="text"
              placeholder="Search by title, code or merchant..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full h-11 pl-11 pr-4 bg-[#E2E4E7] rounded-full text-[13px] font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0094DA]/30 transition-all"
            />
          </div>

          {/* Animated Filter Tabs */}
          <div className="flex items-center p-1 bg-[#DCDFE3] rounded-full shrink-0 relative z-0">
            {(["All", "Active", "Expired"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setFilterMode(mode);
                  setPage(1);
                }}
                className={`relative px-6 py-1.5 rounded-full text-[12px] font-bold transition-colors cursor-pointer z-10 ${
                  filterMode === mode ? "text-gray-800" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {filterMode === mode && (
                  <motion.div
                    layoutId="offerFilterBubble"
                    className="absolute inset-0 bg-[#0094DA] rounded-full shadow-sm -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className={filterMode === mode ? "text-white" : ""}>{mode}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Offer Cards Grid / Loader */}
        <div className="relative min-h-[300px]">
          {(isLoading || isFetching) && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-xs flex items-center justify-center z-30 min-h-[300px] rounded-2xl">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 text-[#0094DA] animate-spin" />
                <p className="text-xs font-semibold text-gray-500">Loading offers...</p>
              </div>
            </div>
          )}

          {offersList.length === 0 && !isLoading ? (
            <div className="py-16 bg-white rounded-2xl border border-gray-100 text-center flex flex-col items-center justify-center gap-3">
              <Ticket className="w-10 h-10 text-gray-300" />
              <p className="text-sm font-semibold text-gray-500">No offers found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {offersList.map((offer: any) => (
                <OfferCard
                  key={offer._id}
                  offer={offer}
                  onDeleteClick={(off) => setOfferToDelete(off)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
          <span className="text-[12px] text-gray-500 font-medium">
            Showing <strong className="font-bold text-gray-700">
              {pagination.total > 0 ? ((pagination.page - 1) * pagination.limit) + 1 : 0} - {Math.min(pagination.page * pagination.limit, pagination.total)}
            </strong> of {pagination.total.toLocaleString()} offers
          </span>
          <div className="flex items-center gap-1.5">
            <button
              disabled={page <= 1 || isLoading}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed border border-gray-200 shadow-sm cursor-pointer hover:bg-gray-50"
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
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed border border-gray-200 shadow-sm hover:bg-gray-50 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {offerToDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOfferToDelete(null)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden p-8 flex flex-col items-center text-center border border-gray-100 z-10"
              >
                <div className="w-16 h-16 rounded-full bg-red-50 text-[#D92D20] flex items-center justify-center mb-6">
                  <AlertTriangle className="w-8 h-8" />
                </div>

                <h3 className="text-[20px] font-bold text-gray-900 mb-2">Delete Offer?</h3>
                <p className="text-[14px] text-gray-500 font-medium mb-8">
                  Are you sure you want to delete{" "}
                  <span className="font-bold text-gray-700">&quot;{offerToDelete.title}&quot;</span> ({offerToDelete.code})? This action cannot be undone.
                </p>

                <div className="flex gap-3 w-full">
                  <button
                    disabled={isDeleting}
                    onClick={() => setOfferToDelete(null)}
                    className="flex-1 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-[14px] hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isDeleting}
                    onClick={handleDeleteOffer}
                    className="flex-1 px-6 py-3 rounded-xl bg-[#D92D20] text-white font-bold text-[14px] hover:bg-[#B42217] transition-colors shadow-lg shadow-red-200 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Delete"}
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
