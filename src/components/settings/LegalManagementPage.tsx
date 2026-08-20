"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit3, ArrowLeft, X, Save, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import TiptapEditor from "@/components/content-management/TiptapEditor";
import {
  useGetSettingsQuery,
  useCreateSettingsMutation,
} from "@/features/settings/settingsApi";

interface LegalManagementPageProps {
  typeKey: "terms_of_service" | "privacy_policy" | "about_us";
  title: string;
  displayTitle: string;
  initialContent: string;
  subtitle: string;
}

export default function LegalManagementPage({
  typeKey,
  title,
  displayTitle,
  initialContent,
  subtitle,
}: LegalManagementPageProps) {
  const router = useRouter();

  // RTK Query Hooks
  const { data: settingRes, isLoading, isFetching } = useGetSettingsQuery(typeKey);
  const [createSettings, { isLoading: isSaving }] = useCreateSettingsMutation();

  const activeContent = settingRes?.data?.content || initialContent;
  const [tempContent, setTempContent] = useState(activeContent);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync tempContent when activeContent changes
  useEffect(() => {
    if (settingRes?.data?.content) {
      setTempContent(settingRes.data.content);
    }
  }, [settingRes]);

  const handleOpenEditModal = () => {
    setTempContent(activeContent);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      await createSettings({
        type: typeKey,
        content: tempContent,
      }).unwrap();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save legal document:", error);
    }
  };

  const lastUpdated = settingRes?.data?.updatedAt
    ? `Last updated: ${new Date(settingRes.data.updatedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })}`
    : subtitle;

  return (
    <div className="w-full py-6 pb-10">
      <div className="w-full flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-8 h-8 rounded-full bg-[#EAECEF] hover:bg-gray-200 flex items-center justify-center cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-gray-600" strokeWidth={2.5} />
            </button>
            <div>
              <h1 className="text-[26px] font-extrabold text-[#111827] leading-tight">{title}</h1>
              <p className="text-[13px] text-gray-400 font-medium">{lastUpdated}</p>
            </div>
          </div>
          <button
            onClick={handleOpenEditModal}
            className="flex items-center gap-2 px-5 py-2 bg-[#0094DA] text-white text-[13px] font-bold rounded-lg hover:bg-[#007BB5] transition-colors cursor-pointer shadow-sm shadow-[#0094DA]/20"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </button>
        </div>

        {/* Display Section */}
        <div className="w-full bg-white border border-gray-100 rounded-[24px] shadow-sm overflow-hidden relative min-h-[300px]">
          {(isLoading || isFetching) && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-xs flex items-center justify-center z-30 min-h-[250px]">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 text-[#0094DA] animate-spin" />
                <p className="text-xs font-semibold text-gray-500">Loading document...</p>
              </div>
            </div>
          )}

          <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100">
            <h2 className="text-[16px] font-bold text-gray-800">{displayTitle}</h2>
          </div>
          <div className="p-8">
            <div
              className="prose prose-blue max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: activeContent }}
            />
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSaving && setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-4xl border border-gray-100 flex flex-col overflow-hidden max-h-[90vh] z-10"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-gray-50/30">
                <div>
                  <h3 className="text-[18px] font-bold text-gray-900">Edit {title}</h3>
                  <p className="text-[12px] text-gray-400 font-medium">Update the content shown to users.</p>
                </div>
                <button
                  disabled={isSaving}
                  onClick={() => setIsModalOpen(false)}
                  className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 border border-gray-100 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Modal Editor Body */}
              <div className="p-8 overflow-y-auto">
                <TiptapEditor
                  content={tempContent}
                  onChange={(newContent) => setTempContent(newContent)}
                />
              </div>

              {/* Modal Actions */}
              <div className="px-8 py-5 border-t border-gray-100 bg-gray-50/30 flex justify-end gap-3">
                <button
                  disabled={isSaving}
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 font-bold text-[14px] hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  disabled={isSaving}
                  onClick={handleSave}
                  className="px-8 py-2.5 rounded-xl bg-[#0094DA] text-white font-bold text-[14px] hover:bg-[#007BB5] transition-colors cursor-pointer shadow-lg shadow-[#0094DA]/20 flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .prose h1 { font-size: 1.8rem; font-weight: 800; margin-bottom: 1rem; color: #111827; }
        .prose h2 { font-size: 1.4rem; font-weight: 700; margin-top: 2rem; margin-bottom: 0.8rem; color: #1f2937; }
        .prose p { margin-bottom: 1rem; }
        .prose ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.5rem; }
        .prose ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1.5rem; }
        .prose strong { font-weight: 700; color: #111827; }
      `}</style>
    </div>
  );
}
