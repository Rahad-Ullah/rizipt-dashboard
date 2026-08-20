"use client";

import {
  Bell,
  ChevronRight,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Image from "next/image";

import { useState, useEffect } from "react";
import LogoutModal from "@/components/modals/LogoutModal";
import { useGetAllNotificationQuery } from "@/features/notification/notificationApi";
import { useGetMyProfileQuery } from "@/features/profile/profileApi";
import { io } from "socket.io-client";
import { baseURL } from "@/utils/BaseURL";
import { getToken } from "@/utils/storage";
import { toast } from "react-hot-toast";

const routeTitleMap: Record<string, string> = {
  "": "Dashboard",
  "notification": "Notifications",
  "users-management": "Users Management",
  "merchants": "Merchants",
  "receipts": "Receipts",
  "offers": "Offers",
  "redemptions": "Redemptions",
  "settings": "Settings",
  "faq": "FAQ's",
  "terms": "Terms of Service",
  "privacy": "Privacy Policy",
  "about": "About Us",
};

export default function MyNavber() {
  const pathname = usePathname();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const { data: notifRes } = useGetAllNotificationQuery({ page: 1, limit: 10 });
  const { data: profileRes } = useGetMyProfileQuery(undefined);

  const profile = profileRes?.data;
  const unreadCount = notifRes?.data?.unreadCount ?? 0;

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const socket = io(baseURL, {
      auth: { token },
      query: { token },
      transports: ["websocket", "polling"],
    });

    socket.on("getNotification", (newNotif: any) => {
      console.log("Realtime notification toast event:", newNotif);
      if (newNotif?.title || newNotif?.message) {
        toast.custom(
          (t) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black/5 p-4 border-l-4 border-[#0094DA]`}
            >
              <div className="flex-1 w-0">
                <div className="flex items-start">
                  <div className="shrink-0 pt-0.5 text-xl">🔔</div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-bold text-gray-900">
                      {newNotif.title || "New Notification"}
                    </p>
                    <p className="mt-1 text-xs text-gray-600 leading-snug">
                      {newNotif.message || "You have a new update"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ),
          { duration: 4000 }
        );
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const getBreadcrumbs = () => {
    const parts = pathname.split("/").filter(Boolean);
    const filteredParts = parts.filter(p => !p.startsWith('('));

    const crumbs = [{ label: "Home Page", href: "/" }];
    let currentPath = "";

    filteredParts.forEach((part) => {
      currentPath += `/${part}`;
      const label = routeTitleMap[part] || part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, " ");
      crumbs.push({ label, href: currentPath });
    });

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="flex h-16 md:h-20 items-center justify-between gap-3 md:gap-4 bg-[#E4E6E9] px-4 md:px-8 w-full shrink-0 border-b border-gray-200/50">

      {/* ── Sidebar Trigger (Mobile/Tablet) ── */}
      <div className="lg:hidden flex items-center">
        <SidebarTrigger className="w-10 h-10 bg-white" />
      </div>

      {/* ── Breadcrumbs ── */}
      <div className="hidden lg:flex items-center gap-2 text-[#737780]">
        {breadcrumbs.map((crumb, i) => (
          <div key={`${crumb.label}-${i}`} className="flex items-center gap-2">
            {i === breadcrumbs.length - 1 ? (
              <span className="text-sm font-semibold text-[#2C2E33]">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="text-sm hover:text-[#2C2E33] transition-colors cursor-pointer"
              >
                {crumb.label}
              </Link>
            )}
            {i < breadcrumbs.length - 1 && <ChevronRight className="w-4 h-4" />}
          </div>
        ))}
      </div>

      {/* ── Right Section ── */}
      <div className="flex items-center gap-5 md:gap-7 ml-auto sm:ml-0 shrink-0">

        {/* Notification Bell */}
        <Link href="/notification" className="flex items-center">
          <button className="relative flex items-center justify-center cursor-pointer transition-colors group outline-none p-1">
            <Bell className="w-6 h-6 text-[#4B5563] group-hover:text-[#0094DA] transition-colors stroke-[2]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1.5 min-w-[18px] h-[18px] px-1 bg-[#FF4500] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-sm border-2 border-[#E4E6E9]">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
        </Link>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-300"></div>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3.5 cursor-pointer group outline-none pl-1">
              <div className="hidden sm:flex flex-col items-end justify-center">
                <p className="text-[14px] font-bold text-gray-900 leading-tight mb-0.5">
                  {profile?.firstName ? `${profile.firstName} ${profile.lastName || ""}` : "Admin"}
                </p>
                <p className="text-[12px] font-medium text-gray-500 leading-tight capitalize">
                  {profile?.role ? profile.role.replace("_", " ") : "Super Admin"}
                </p>
              </div>
              <div className="relative w-10 h-10 rounded-full bg-[#E5E7EB] ring-2 ring-[#0094DA] ring-offset-2 ring-offset-[#E4E6E9] shadow-sm flex items-center justify-center overflow-hidden transition-transform group-active:scale-95">
                <Image
                  src={profile?.image || "/images/auth/image.png"}
                  alt="Profile"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={15}
            className="w-56 bg-white border border-gray-200 rounded-xl p-1 shadow-xl relative overflow-hidden"
          >
            <DropdownMenuItem asChild className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors focus:bg-gray-100 outline-none rounded-lg mb-1">
              <Link href="/profile">
                <span className="text-[14px] font-medium text-gray-700">My Profile</span>
              </Link>
            </DropdownMenuItem>
            <div className="h-px bg-gray-200 w-full my-1" />
            <DropdownMenuItem
              onClick={() => setIsLogoutModalOpen(true)}
              className="flex items-center px-4 py-3 cursor-pointer hover:bg-red-50 transition-colors focus:bg-red-50 outline-none rounded-lg text-red-600"
            >
              <span className="text-[14px] font-medium">Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </header>
  );
}
