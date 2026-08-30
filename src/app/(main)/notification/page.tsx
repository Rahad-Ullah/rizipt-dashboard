"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  CheckCheck,
  Clock,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  FileText,
  AlertCircle,
  Tag,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import {
  useGetAllNotificationQuery,
  useReadSingleNotificationMutation,
  useReadAllNotificationMutation,
} from "@/features/notification/notificationApi";

interface NotificationItem {
  _id: string;
  type: string;
  title: string;
  message: string;
  receiver?: string;
  referenceId?: string;
  isRead: boolean;
  createdAt: string;
}

const filterTabs = ["All", "Unread"] as const;
type FilterTab = typeof filterTabs[number];

function formatTimeAgo(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export default function NotificationPage() {
  const [page, setPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");

  // RTK Query Hooks
  const { data: notifRes, isLoading, isFetching } = useGetAllNotificationQuery({
    page,
    limit: 10,
  });

  const [readSingleNotification] = useReadSingleNotificationMutation();
  const [readAllNotification, { isLoading: isReadingAll }] = useReadAllNotificationMutation();

  const notificationList: NotificationItem[] =
    notifRes?.data?.data || (Array.isArray(notifRes?.data) ? notifRes.data : []);

  const unreadCount = notifRes?.data?.unreadCount ?? notificationList.filter((n) => !n.isRead).length;
  const pagination = notifRes?.pagination || { total: 0, limit: 10, page: 1, totalPage: 1 };

  const filteredList = notificationList.filter((item) => {
    if (activeFilter === "Unread") return !item.isRead;
    return true;
  });

  const handleMarkAllRead = async () => {
    try {
      await readAllNotification(undefined).unwrap();
      toast.success("All notifications marked as read");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to mark notifications as read");
    }
  };

  const handleNotificationClick = async (item: NotificationItem) => {
    if (!item.isRead) {
      try {
        await readSingleNotification(item._id).unwrap();
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    }
  };

  const getNotificationConfig = (type: string) => {
    switch (type) {
      case "policy_updated":
      case "legal":
        return { icon: FileText, bg: "bg-blue-100", iconColor: "text-blue-600", label: "Policy" };
      case "offer":
      case "coupon":
        return { icon: Tag, bg: "bg-purple-100", iconColor: "text-purple-600", label: "Offer" };
      case "receipt":
      case "order":
        return { icon: Package, bg: "bg-orange-100", iconColor: "text-[#0094DA]", label: "Receipt" };
      case "alert":
        return { icon: AlertCircle, bg: "bg-red-100", iconColor: "text-red-500", label: "Alert" };
      default:
        return { icon: ShieldCheck, bg: "bg-green-100", iconColor: "text-green-600", label: "System" };
    }
  };

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-500 relative">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">Notifications</h1>
          <p className="text-gray-500 mt-1.5 text-xs sm:text-sm font-medium">
            {unreadCount > 0 ? (
              <span>
                You have <span className="text-[#0094DA] font-bold">{unreadCount} unread</span> notification{unreadCount > 1 ? "s" : ""}.
              </span>
            ) : (
              "You're all caught up!"
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0 || isReadingAll}
            className="flex-1 sm:flex-none h-11 px-5 rounded-xl border-gray-200 text-xs sm:text-sm font-bold text-gray-700 hover:bg-gray-50 cursor-pointer disabled:opacity-40 transition-colors"
          >
            {isReadingAll ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin text-[#0094DA]" />
            ) : (
              <CheckCheck className="w-4 h-4 mr-2 text-[#0094DA]" />
            )}
            Mark all read
          </Button>
        </div>
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0 sm:flex-wrap">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={cn(
              "px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap",
              activeFilter === tab
                ? "bg-[#0094DA] text-white shadow-md shadow-[#0094DA]/20"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200/80"
            )}
          >
            {tab}
            {tab === "Unread" && unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-white/30 text-[10px] font-extrabold">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Notification List ── */}
      <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden relative">
        {(isLoading || isFetching) && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-xs flex items-center justify-center z-30 min-h-[250px]">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-[#0094DA] animate-spin" />
              <p className="text-xs font-semibold text-gray-500">Loading notifications...</p>
            </div>
          </div>
        )}

        <AnimatePresence initial={false} mode="popLayout">
          {filteredList.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 sm:py-28 text-center px-6"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-50 flex items-center justify-center mb-4 border border-gray-100">
                <Bell className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300" />
              </div>
              <p className="text-base sm:text-lg font-bold text-gray-600">No notifications found</p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1 font-medium">Check back later for updates</p>
            </motion.div>
          ) : (
            filteredList.map((notif, index) => {
              const cfg = getNotificationConfig(notif.type);
              const Icon = cfg.icon;

              return (
                <motion.div
                  key={notif._id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  onClick={() => handleNotificationClick(notif)}
                  className={cn(
                    "flex items-start gap-4 px-5 sm:px-6 py-4.5 border-b border-gray-100 last:border-none cursor-pointer transition-colors group relative",
                    !notif.isRead ? "bg-[#F0F9FF]" : "bg-white hover:bg-gray-50/80"
                  )}
                >
                  {/* Read Indicator Line */}
                  {!notif.isRead && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0094DA]" />
                  )}

                  {/* Icon */}
                  <div className={cn("w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-xs", cfg.bg)}>
                    <Icon className={cn("w-5 h-5", cfg.iconColor)} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="w-full">
                        <div className="flex items-center gap-2">
                          <p className={cn("text-[14px] text-gray-900 truncate", !notif.isRead ? "font-bold" : "font-semibold")}>
                            {notif.title}
                          </p>
                          {!notif.isRead && (
                            <span className="w-2 h-2 rounded-full bg-[#0094DA] shrink-0 animate-pulse" />
                          )}
                        </div>
                        <p className="text-xs sm:text-[13px] text-gray-600 mt-1 leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center gap-3 mt-2.5">
                      <span className={cn("px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider", cfg.bg, cfg.iconColor)}>
                        {cfg.label}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {formatTimeAgo(notif.createdAt)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>

        {/* Pagination Footer */}
        {pagination.totalPage > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
            <p className="text-xs font-semibold text-gray-500">
              Page <span className="text-gray-900 font-bold">{pagination.page}</span> of{" "}
              <span className="text-gray-900 font-bold">{pagination.totalPage}</span> ({pagination.total} total)
            </p>
            <div className="flex items-center gap-1.5">
              <button
                disabled={page <= 1 || isFetching}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>

              {Array.from({ length: pagination.totalPage || 1 }, (_, i) => i + 1)
                .filter((pNum) => pNum === 1 || pNum === pagination.totalPage || Math.abs(pNum - page) <= 1)
                .map((pNum) => (
                  <button
                    key={pNum}
                    onClick={() => setPage(pNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer ${
                      page === pNum
                        ? "bg-[#0094DA] text-white border border-[#0094DA]"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {pNum}
                  </button>
                ))}

              <button
                disabled={page >= pagination.totalPage || isFetching}
                onClick={() => setPage((p) => Math.min(pagination.totalPage, p + 1))}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}