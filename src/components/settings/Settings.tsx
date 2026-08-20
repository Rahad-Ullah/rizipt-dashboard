"use client";

import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, X, Save } from "lucide-react";
import { useRouter } from "next/navigation";

const legalDocs = [
  { id: 1, title: "FAQ's", updated: "2024-01-20", route: "/settings/faq" },
  { id: 2, title: "Terms of Service", updated: "2024-02-15", route: "/settings/terms" },
  { id: 3, title: "Privacy Policy", updated: "2024-02-15", route: "/settings/privacy" },
  { id: 4, title: "About Us", updated: "2024-02-18", route: "/settings/about" },
];

function SettingsInner() {
  const router = useRouter();
  const [editingDoc, setEditingDoc] = useState<typeof legalDocs[0] | null>(null);
  const [editContent, setEditContent] = useState("");

  return (
    <div className="w-full py-6 pb-10">
      <div className="w-full flex flex-col gap-6">

        {/* Header */}
        <div>
          <h1 className="text-[28px] font-extrabold text-[#111827]">Settings</h1>
          <p className="text-[14px] font-medium text-gray-500 mt-1">Modify or update terms of service, privacy policies, FAQs, and other legal documents.</p>
        </div>

        {/* Legal Documents Content */}
        <div className="flex flex-col gap-4">
          {/* Document List */}
          {legalDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => router.push(doc.route)}
              className="bg-white cursor-pointer border border-gray-200/60 hover:border-[#0094DA]/40 transition-colors shadow-xs rounded-2xl px-6 py-5 flex items-center justify-between"
            >
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
        </div>
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
