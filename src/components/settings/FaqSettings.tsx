"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, Plus, Trash2, Loader2, Edit3 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useGetAllFaqQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} from "@/features/faq/faqApi";

type FAQ = {
  _id: string;
  question: string;
  answer: string;
  createdAt?: string;
  updatedAt?: string;
};

type ModalMode = "add" | "edit" | null;

export default function FaqSettings() {
  const router = useRouter();
  const [tableSearch, setTableSearch] = useState("");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [formQuestion, setFormQuestion] = useState("");
  const [formAnswer, setFormAnswer] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // RTK Query Hooks
  const { data: faqRes, isLoading, isFetching } = useGetAllFaqQuery(undefined);
  const [createFaq, { isLoading: isCreating }] = useCreateFaqMutation();
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();
  const [deleteFaq, { isLoading: isDeleting }] = useDeleteFaqMutation();

  const faqs: FAQ[] = faqRes?.data ? [...faqRes.data].reverse() : [];

  const openAdd = () => {
    setFormQuestion("");
    setFormAnswer("");
    setEditingFaq(null);
    setModalMode("add");
  };

  const openEdit = (faq: FAQ) => {
    setFormQuestion(faq.question);
    setFormAnswer(faq.answer);
    setEditingFaq(faq);
    setModalMode("edit");
  };

  const handleSubmit = async () => {
    if (!formQuestion.trim() || !formAnswer.trim()) return;

    try {
      if (modalMode === "add") {
        await createFaq({
          question: formQuestion.trim(),
          answer: formAnswer.trim(),
        }).unwrap();
      } else if (modalMode === "edit" && editingFaq) {
        await updateFaq({
          id: editingFaq._id,
          data: {
            question: formQuestion.trim(),
            answer: formAnswer.trim(),
          },
        }).unwrap();
      }
      setModalMode(null);
    } catch (error) {
      console.error("Failed to save FAQ:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteFaq(id).unwrap();
      setDeleteConfirmId(null);
    } catch (error) {
      console.error("Failed to delete FAQ:", error);
    }
  };

  const filtered = faqs.filter((f) =>
    f.question.toLowerCase().includes(tableSearch.toLowerCase()) ||
    f.answer.toLowerCase().includes(tableSearch.toLowerCase())
  );

  return (
    <div className="w-full py-6 pb-10">
      <div className="w-full flex flex-col gap-6">

        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-1">
            <button
              onClick={() => router.back()}
              className="w-8 h-8 rounded-full bg-[#EAECEF] hover:bg-gray-200 flex items-center justify-center cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-gray-600" strokeWidth={2.5} />
            </button>
            <h1 className="text-[26px] font-extrabold text-[#111827]">FAQ&apos;s Settings</h1>
          </div>
          <p className="text-[13px] text-gray-400 font-medium ml-11">{faqs.length} faq&apos;s published</p>
        </div>

        {/* FAQ List Card */}
        <div className="bg-white border border-gray-200/60 rounded-2xl overflow-hidden shadow-sm relative">
          {(isLoading || isFetching) && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-xs flex items-center justify-center z-30 min-h-[250px]">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 text-[#0094DA] animate-spin" />
                <p className="text-xs font-semibold text-gray-500">Loading FAQs...</p>
              </div>
            </div>
          )}

          {/* Card header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-[16px] font-bold text-gray-900">FAQ List</h2>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#0094DA] text-white text-[13px] font-bold rounded-xl hover:bg-[#007BB5] transition-colors cursor-pointer shadow-sm shadow-[#0094DA]/20"
            >
              <Plus className="w-4 h-4" strokeWidth={3} />
              Add FAQ
            </button>
          </div>

          {/* Table search */}
          <div className="px-6 py-3 border-b border-gray-100 flex justify-end">
            <div className="relative w-full max-w-xs flex items-center">
              <Search className="absolute left-3 w-3.5 h-3.5 text-gray-400" strokeWidth={2.5} />
              <input
                type="text"
                placeholder="Search Questions..."
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#F0F2F5] rounded-lg text-[12px] font-medium text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0094DA]/20"
              />
            </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-12 px-6 py-3 bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
            <div className="col-span-4">Question</div>
            <div className="col-span-6">Answer Snippet</div>
            <div className="col-span-2 text-right">Action</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-100">
            {filtered.length === 0 && !isLoading && (
              <div className="py-12 text-center text-gray-400 text-sm font-medium">
                No FAQs found.
              </div>
            )}

            {filtered.map((faq) => (
              <div key={faq._id} className="grid grid-cols-12 px-6 py-3.5 items-center hover:bg-gray-50/70 transition-colors">
                <div className="col-span-4 text-[13px] text-gray-800 font-semibold pr-4 truncate">{faq.question}</div>
                <div className="col-span-6 text-[13px] text-gray-500 font-medium pr-4 truncate">
                  {faq.answer}
                </div>
                <div className="col-span-2 flex items-center justify-end gap-3">
                  <button
                    onClick={() => openEdit(faq)}
                    className="text-[12px] font-bold text-[#D97706] hover:text-[#B45309] transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(faq._id)}
                    className="text-[12px] font-bold text-[#E11D48] hover:text-[#BE123C] transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Add / Edit FAQ Modal ── */}
      <AnimatePresence>
        {modalMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isCreating && !isUpdating && setModalMode(null)}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative bg-white rounded-[20px] shadow-2xl w-full max-w-lg border border-gray-100 p-8 z-10"
            >
              {/* Header */}
              <div className="text-center mb-6">
                <h3 className="text-[20px] font-bold text-gray-900">Frequently Asked Questions</h3>
                <p className="text-[13px] text-gray-400 font-medium mt-1">
                  {modalMode === "add" ? "Create a frequently asked question to help users." : "Edit a frequently asked question to help users."}
                </p>
              </div>

              {/* Form */}
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-2">FAQ Question</label>
                  <input
                    type="text"
                    placeholder="Enter the question here"
                    value={formQuestion}
                    onChange={(e) => setFormQuestion(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[13px] font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0094DA]/30"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-2">Answer</label>
                  <textarea
                    rows={5}
                    placeholder="Provide a detailed answer"
                    value={formAnswer}
                    onChange={(e) => setFormAnswer(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[13px] font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0094DA]/30 resize-none"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  disabled={isCreating || isUpdating}
                  onClick={() => setModalMode(null)}
                  className="flex-1 py-3 rounded-xl bg-[#EAECEF] text-gray-700 font-bold text-[14px] hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  disabled={isCreating || isUpdating || !formQuestion.trim() || !formAnswer.trim()}
                  onClick={handleSubmit}
                  className="flex-1 py-3 rounded-xl bg-[#0094DA] text-white font-bold text-[14px] hover:bg-[#007BB5] transition-colors cursor-pointer shadow-lg shadow-[#0094DA]/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {(isCreating || isUpdating) ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : modalMode === "add" ? (
                    "Submit"
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Delete Confirmation Modal ── */}
      <AnimatePresence>
        {deleteConfirmId !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setDeleteConfirmId(null)}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative bg-white rounded-[20px] shadow-2xl w-full max-w-sm border border-gray-100 p-8 text-center z-10"
            >
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-[#E11D48]" strokeWidth={2} />
              </div>
              <h3 className="text-[18px] font-bold text-gray-900 mb-1">Delete FAQ?</h3>
              <p className="text-[13px] text-gray-400 font-medium mb-6">This action cannot be undone. The FAQ will be permanently removed.</p>
              <div className="flex gap-3">
                <button
                  disabled={isDeleting}
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-[14px] hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  disabled={isDeleting}
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="flex-1 py-3 rounded-xl bg-[#E11D48] text-white font-bold text-[14px] hover:bg-[#BE123C] transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
