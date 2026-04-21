"use client";

import { useState, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileImage, FileText, X, Save } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const legalDocs = [
  { id: 1, title: "FAQ's", updated: "2024-01-20", route: "/settings/faq" },
  { id: 2, title: "Terms of Service", updated: "2024-02-15", route: "/settings/terms" },
  { id: 3, title: "Privacy Policy", updated: "2024-02-15", route: "/settings/privacy" },
  { id: 4, title: "About Us", updated: "2024-02-18", route: "/settings/about" },
];

function SettingsInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab: "General" | "Legal Documents" =
    tabParam === "legal" ? "Legal Documents" : "General";

  const setActiveTab = (tab: "General" | "Legal Documents") => {
    router.replace(`?tab=${tab === "Legal Documents" ? "legal" : "general"}`);
  };

  const [appName, setAppName] = useState("RIZIPT");
  const [logoPath, setLogoPath] = useState("/uploads/rizipt-logo.svg");
  const [editingDoc, setEditingDoc] = useState<typeof legalDocs[0] | null>(null);
  const [editContent, setEditContent] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setLogoPath(`/uploads/${file.name}`);
  };

  return (
    <div className="w-full py-6 pb-10">
      <div className="w-full flex flex-col gap-6">

        {/* Header */}
        <div>
          <h1 className="text-[28px] font-extrabold text-[#111827]">Settings</h1>
          <p className="text-[14px] font-medium text-gray-500 mt-1">Review, verify and manage merchant registrations across the ecosystem.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-[#EAECEF] rounded-full p-1 w-fit">
          {(["General", "Legal Documents"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-6 py-2 rounded-full text-[13px] font-bold transition-colors cursor-pointer z-10 ${activeTab === tab ? "text-white" : "text-gray-500 hover:text-gray-700"
                }`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="settingsTabBubble"
                  className="absolute inset-0 bg-[#0094DA] rounded-full -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "General" && (
            <motion.div
              key="general"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              {/* Section Header */}
              <div className="bg-white border border-gray-200/60 rounded-2xl px-6 py-5">
                <h2 className="text-[16px] font-bold text-gray-900">Platform Branding</h2>
                <p className="text-[13px] text-gray-500 font-medium mt-1">Control logos, images, text, and other assets used within the platform</p>
              </div>

              {/* Main Logo */}
              <div className="bg-white border border-gray-200/60 rounded-2xl px-6 py-5">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#EBF5FB] flex items-center justify-center flex-shrink-0">
                    <FileImage className="w-5 h-5 text-[#0094DA]" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-gray-900">Main Logo</p>
                    <p className="text-[12px] text-gray-500 font-medium">Primary logo used in navigation and marketing</p>
                  </div>
                </div>
                <div className="flex gap-3 items-center">
                  <input
                    readOnly
                    value={logoPath}
                    className="flex-1 px-4 py-2.5 bg-[#F0F2F5] rounded-lg text-[12px] font-mono text-gray-600 border border-gray-200/80 focus:outline-none"
                  />
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-2.5 bg-[#0094DA] text-white text-[13px] font-bold rounded-lg hover:bg-[#007BB5] transition-colors cursor-pointer shadow-sm shadow-[#0094DA]/20 shrink-0"
                  >
                    Upload Logo
                  </button>
                </div>
              </div>

              {/* Application Name */}
              <div className="bg-white border border-gray-200/60 rounded-2xl px-6 py-5">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#EBF5FB] flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-[#0094DA]" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-gray-900">Application Name</p>
                    <p className="text-[12px] text-gray-500 font-medium">Displayed in page titles and headers</p>
                  </div>
                </div>
                <div className="flex gap-3 items-center">
                  <input
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-[#F0F2F5] rounded-lg text-[13px] font-medium text-gray-700 border border-gray-200/80 focus:outline-none focus:ring-2 focus:ring-[#0094DA]/30"
                  />
                  <button className="px-5 py-2.5 bg-[#0094DA] text-white text-[13px] font-bold rounded-lg hover:bg-[#007BB5] transition-colors cursor-pointer shadow-sm shadow-[#0094DA]/20 shrink-0">
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "Legal Documents" && (
            <motion.div
              key="legal"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              {/* Section Header */}
              <div className="bg-white border border-gray-200/60 rounded-2xl px-6 py-5">
                <h2 className="text-[16px] font-bold text-gray-900">Legal Documents</h2>
                <p className="text-[13px] text-gray-500 font-medium mt-1">Modify or update terms of service, privacy policies, and other legal documents</p>
              </div>

              {/* Document List */}
              {legalDocs.map((doc) => (
                <div key={doc.id} onClick={() => router.push(doc.route)} className="bg-white cursor-pointer border border-gray-200/60 rounded-2xl px-6 py-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#F0F2F5] flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-gray-500" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-gray-900">{doc.title}</p>
                      <p className="text-[12px] text-gray-400 font-medium">Last updated: {doc.updated}</p>
                    </div>
                  </div>

                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Edit Legal Doc Modal ── */}
      <AnimatePresence>
        {editingDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingDoc(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-lg border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setEditingDoc(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer z-10"
              >
                <X className="w-4 h-4 text-gray-600" strokeWidth={2.5} />
              </button>

              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EBF5FB] flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-[#0094DA]" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-[16px] font-bold text-gray-900">{editingDoc.title}</p>
                    <p className="text-[11px] text-gray-400 font-medium">Last updated: {editingDoc.updated}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 flex flex-col gap-4">
                <textarea
                  rows={8}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F0F2F5] rounded-xl text-[13px] font-medium text-gray-700 border border-gray-200/80 focus:outline-none focus:ring-2 focus:ring-[#0094DA]/30 resize-none"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditingDoc(null)}
                    className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-[14px] hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setEditingDoc(null)}
                    className="flex-1 py-3 rounded-xl bg-[#0094DA] text-white font-bold text-[14px] hover:bg-[#007BB5] transition-colors cursor-pointer shadow-lg shadow-[#0094DA]/20 flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" strokeWidth={2.5} />
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
