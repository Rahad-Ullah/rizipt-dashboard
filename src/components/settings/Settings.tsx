"use client";

import { useState, useEffect, Suspense } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Link2,
  Edit2,
  X,
  Save,
  Loader2,
  ChevronRight,
  ExternalLink,
  Smartphone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAddAppLinKMutation, useGetAppLinkQuery } from "@/features/settings/settingsApi";
import toast from "react-hot-toast";

const legalDocs = [
  {
    id: 1,
    title: "FAQ's",
    description: "Frequently asked questions for users",
    updated: "2024-01-20",
    route: "/settings/faq",
    color: "#F59E0B",
    bg: "#FFFBEB",
  },
  {
    id: 2,
    title: "Terms of Service",
    description: "User agreement and service conditions",
    updated: "2024-02-15",
    route: "/settings/terms",
    color: "#0094DA",
    bg: "#EBF5FB",
  },
  {
    id: 3,
    title: "Privacy Policy",
    description: "Data handling and privacy practices",
    updated: "2024-02-15",
    route: "/settings/privacy",
    color: "#10B981",
    bg: "#ECFDF5",
  },
  {
    id: 4,
    title: "About Us",
    description: "Company information and mission",
    updated: "2024-02-18",
    route: "/settings/about",
    color: "#8B5CF6",
    bg: "#F5F3FF",
  },
];

function SkeletonBar({ w = "w-40" }: { w?: string }) {
  return (
    <div className={`h-3.5 ${w} bg-gray-100 animate-pulse rounded-full mt-1`} />
  );
}

function SettingsInner() {
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);
  const [isAppLinkModalOpen, setIsAppLinkModalOpen] = useState(false);
  const [googlePlay, setGooglePlay] = useState("");
  const [appleStore, setAppleStore] = useState("");

  useEffect(() => { setIsMounted(true); }, []);

  const { data: appLinkData, isLoading: isAppLinkLoading } =
    useGetAppLinkQuery(undefined);
  const [addAppLink, { isLoading: isSaving }] = useAddAppLinKMutation();

  useEffect(() => {
    if (appLinkData?.data?.mobileAppLink) {
      setGooglePlay(appLinkData.data.mobileAppLink.googlePlay ?? "");
      setAppleStore(appLinkData.data.mobileAppLink.appleStore ?? "");
    }
  }, [appLinkData]);

  const handleOpenAppLinkModal = () => {
    if (appLinkData?.data?.mobileAppLink) {
      setGooglePlay(appLinkData.data.mobileAppLink.googlePlay ?? "");
      setAppleStore(appLinkData.data.mobileAppLink.appleStore ?? "");
    }
    setIsAppLinkModalOpen(true);
  };

  const handleSaveAppLinks = async () => {
    try {
      await addAppLink({
        mobileAppLink: { googlePlay, appleStore },
      }).unwrap();
      toast.success("App links updated successfully!");
      setIsAppLinkModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to update app links.");
    }
  };

  const savedGooglePlay = appLinkData?.data?.mobileAppLink?.googlePlay ?? "";
  const savedAppleStore = appLinkData?.data?.mobileAppLink?.appleStore ?? "";

  return (
    <div className="w-full py-6 pb-16">
      <div className="w-full flex flex-col gap-10">

        {/* ── Page Header ──────────────────────────────────────────── */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-extrabold text-[#111827] tracking-tight">
              Settings
            </h1>
            <p className="text-[14px] font-medium text-gray-400 mt-1">
              Manage app links, legal documents, and platform configurations.
            </p>
          </div>
        </div>

        {/* ── App Links Section ────────────────────────────────────── */}
        <section className="flex flex-col gap-4">
          {/* Section label */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-1 h-5 rounded-full bg-[#0094DA]" />
              <h2 className="text-[15px] font-extrabold text-[#111827] tracking-tight">
                App Links
              </h2>
            </div>
            <button
              onClick={handleOpenAppLinkModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0094DA] text-white text-[13px] font-bold hover:bg-[#007BB5] active:scale-95 transition-all cursor-pointer shadow-md shadow-[#0094DA]/25"
            >
              <Edit2 className="w-3.5 h-3.5" strokeWidth={2.5} />
              Edit Links
            </button>
          </div>

          {/* App Link Cards — two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Google Play Card */}
            <div className="bg-white border border-gray-200/70 rounded-2xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-md hover:border-[#2E7D32]/20 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] flex items-center justify-center">
                    {/* Google Play SVG icon */}
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                      <path d="M3.18 23.5a1.5 1.5 0 0 1-.68-.16A1.5 1.5 0 0 1 1.5 22V2A1.5 1.5 0 0 1 2.5.66l12.26 10.78L3.18 23.5Z" fill="#EA4335" />
                      <path d="M21.5 12 17.6 14.3l-2.84-2.49 2.84-2.51L21.5 12Z" fill="#FBBC04" />
                      <path d="M3.18 23.5l11.6-5.7 2.84-2.49L3.18 23.5Z" fill="#34A853" />
                      <path d="M3.18.5l11.6 5.7 2.84 2.51L3.18.5Z" fill="#4285F4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[13px] font-extrabold text-[#111827]">
                      Google Play Store
                    </p>
                    <span className="text-[11px] font-semibold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-full mt-0.5 inline-block">
                      Android
                    </span>
                  </div>
                </div>
                {savedGooglePlay && (
                  <a
                    href={savedGooglePlay}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-[#0094DA] transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Store URL
                </p>
                {isAppLinkLoading ? (
                  <SkeletonBar w="w-52" />
                ) : (
                  <p
                    className={`text-[12.5px] font-medium break-all leading-relaxed ${
                      savedGooglePlay ? "text-gray-700" : "text-gray-300 italic"
                    }`}
                  >
                    {savedGooglePlay || "No link set yet"}
                  </p>
                )}
              </div>
            </div>

            {/* Apple Store Card */}
            <div className="bg-white border border-gray-200/70 rounded-2xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-md hover:border-[#7B1FA2]/20 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F3E5F5] flex items-center justify-center">
                    {/* Apple SVG icon */}
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#7B1FA2">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[13px] font-extrabold text-[#111827]">
                      Apple App Store
                    </p>
                    <span className="text-[11px] font-semibold text-[#7B1FA2] bg-[#F3E5F5] px-2 py-0.5 rounded-full mt-0.5 inline-block">
                      iOS
                    </span>
                  </div>
                </div>
                {savedAppleStore && (
                  <a
                    href={savedAppleStore}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-[#0094DA] transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Store URL
                </p>
                {isAppLinkLoading ? (
                  <SkeletonBar w="w-52" />
                ) : (
                  <p
                    className={`text-[12.5px] font-medium break-all leading-relaxed ${
                      savedAppleStore ? "text-gray-700" : "text-gray-300 italic"
                    }`}
                  >
                    {savedAppleStore || "No link set yet"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── Legal Documents Section ──────────────────────────────── */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-1 h-5 rounded-full bg-[#F59E0B]" />
            <h2 className="text-[15px] font-extrabold text-[#111827] tracking-tight">
              Legal Documents
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {legalDocs.map((doc, i) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.25 }}
                onClick={() => router.push(doc.route)}
                className="group bg-white cursor-pointer border border-gray-200/70 hover:border-gray-300/60 hover:shadow-md transition-all rounded-2xl px-5 py-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: doc.bg }}
                  >
                    <FileText
                      className="w-5 h-5"
                      style={{ color: doc.color }}
                      strokeWidth={2}
                    />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-gray-900">
                      {doc.title}
                    </p>
                    <p className="text-[12px] text-gray-400 font-medium mt-0.5">
                      {doc.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-semibold text-gray-400 hidden sm:block">
                    Updated {doc.updated}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-gray-50 group-hover:bg-[#EBF5FB] flex items-center justify-center transition-colors">
                    <ChevronRight
                      className="w-4 h-4 text-gray-400 group-hover:text-[#0094DA] transition-colors"
                      strokeWidth={2.5}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

      </div>

      {/* ── App Link Edit Modal — rendered via Portal to avoid fixed-in-transform bug ── */}
      {isMounted && createPortal(
        <AnimatePresence>
          {isAppLinkModalOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => !isSaving && setIsAppLinkModalOpen(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
              />

              {/* Modal Panel */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-md border border-gray-100 overflow-hidden"
              >
                {/* Close */}
                <button
                  onClick={() => !isSaving && setIsAppLinkModalOpen(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer z-10"
                >
                  <X className="w-4 h-4 text-gray-600" strokeWidth={2.5} />
                </button>

                {/* Modal Header with gradient top bar */}
                <div className="h-1 w-full bg-gradient-to-r from-[#0094DA] via-[#00C6FF] to-[#0094DA]" />
                <div className="px-6 pt-5 pb-5 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EBF5FB] flex items-center justify-center flex-shrink-0">
                      <Link2 className="w-5 h-5 text-[#0094DA]" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-[16px] font-extrabold text-gray-900">
                        Edit App Links
                      </p>
                      <p className="text-[12px] text-gray-400 font-medium">
                        Update your mobile app store URLs
                      </p>
                    </div>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="px-6 py-6 flex flex-col gap-5">
                  {/* Google Play Input */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[12px] font-extrabold text-gray-600 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-4 h-4 rounded bg-[#E8F5E9] inline-flex items-center justify-center">
                        <Smartphone className="w-2.5 h-2.5 text-[#2E7D32]" strokeWidth={2.5} />
                      </span>
                      Google Play Store
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={googlePlay}
                        onChange={(e) => setGooglePlay(e.target.value)}
                        placeholder="Input google play store link"
                        className="w-full pl-4 pr-10 py-3.5 bg-[#F8FAFC] rounded-xl text-[13px] font-medium text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0094DA]/25 focus:border-[#0094DA]/60 transition-all placeholder:text-gray-300"
                      />
                      {googlePlay && (
                        <button
                          type="button"
                          onClick={() => setGooglePlay("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Apple Store Input */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[12px] font-extrabold text-gray-600 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-4 h-4 rounded bg-[#F3E5F5] inline-flex items-center justify-center">
                        <Smartphone className="w-2.5 h-2.5 text-[#7B1FA2]" strokeWidth={2.5} />
                      </span>
                      Apple App Store
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={appleStore}
                        onChange={(e) => setAppleStore(e.target.value)}
                        placeholder="Input apple store link"
                        className="w-full pl-4 pr-10 py-3.5 bg-[#F8FAFC] rounded-xl text-[13px] font-medium text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0094DA]/25 focus:border-[#0094DA]/60 transition-all placeholder:text-gray-300"
                      />
                      {appleStore && (
                        <button
                          type="button"
                          onClick={() => setAppleStore("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={() => setIsAppLinkModalOpen(false)}
                      disabled={isSaving}
                      className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold text-[14px] hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveAppLinks}
                      disabled={isSaving}
                      className="flex-1 py-3 rounded-xl bg-[#0094DA] text-white font-bold text-[14px] hover:bg-[#007BB5] active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-[#0094DA]/25 flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" strokeWidth={2.5} />
                      )}
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

export default function Settings() {
  return (
    <Suspense fallback={null}>
      <SettingsInner />
    </Suspense>
  );
}
