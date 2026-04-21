"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Gift,
  LayoutGrid,
  LogOut,
  ReceiptText,
  Settings,
  Store,
  Tag,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navigationItems = [
  { name: "Dashboard", path: "/", icon: LayoutGrid },
  { name: "Users", path: "/users-management", icon: Users },
  { name: "Merchants", path: "/merchants", icon: Store },
  { name: "Receipts", path: "/receipts", icon: ReceiptText },
  { name: "Offers", path: "/offers", icon: Tag },
  { name: "Redemptions", path: "/redemptions", icon: Gift },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function AppSideBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { state, setOpenMobile } = useSidebar();
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const handleLogout = () => {
    setOpenMobile(false);
    router.push("/auth/login");
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0 border-none bg-[#E4E6E9]">
      <SidebarContent
        className="flex flex-col h-full bg-[#E4E6E9]"
      >
        {/* ── Logo & Title ── */}
        <SidebarHeader className="px-6 pt-10 pb-6 flex flex-col items-center">
          <Link href="/" className="flex flex-col items-center justify-center w-full" onClick={() => setOpenMobile(false)}>
            <div className={cn("relative flex justify-center w-full mb-3", isCollapsed ? "h-10" : "h-16")}>
              <Image
                src="/icons/logo.png"
                fill
                alt="Rizipt"
                className="object-contain"
                priority
              />
            </div>
            {!isCollapsed && (
              <div className="text-center w-full flex flex-col items-center">
                <h1 className="text-xl font-extrabold text-black tracking-tight mb-0.5 whitespace-nowrap">Admin Dashboard</h1>
                <p className="text-xs text-gray-500 font-medium whitespace-nowrap">Receipt Observatory</p>
              </div>
            )}
          </Link>
        </SidebarHeader>

        {/* ── Navigation List ── */}
        <div className="flex-1 overflow-y-auto px-4 custom-scrollbar lg:py-6">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="gap-2.5">
                {navigationItems.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.name}
                        className={cn(
                          "h-12 px-5 transition-all duration-200 group relative",
                          active
                            ? "bg-[#DDEBFA] text-[#0094DA] rounded-full hover:bg-[#DDEBFA] hover:text-[#0094DA]"
                            : "text-[#6B717B] hover:bg-gray-200/50 hover:text-black rounded-lg"
                        )}
                      >
                        <Link href={item.path} className="flex items-center w-full" onClick={() => setOpenMobile(false)}>
                          <div className="flex items-center gap-4">
                            <item.icon className={cn("w-[22px] h-[22px]", active ? "text-[#0094DA] stroke-[2.5]" : "text-[#6B717B] stroke-2")} />
                            {!isCollapsed && (
                              <span className={cn("text-[15px]", active ? "font-bold" : "font-medium")}>
                                {item.name}
                              </span>
                            )}
                          </div>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* ── Footer / Logout ── */}
        <SidebarFooter className="p-6 mt-auto flex flex-col items-center">
          <button
            onClick={handleLogout}
            className={cn(
              "w-full h-11 border border-[#D92D20] text-[#D92D20] rounded-xl flex items-center justify-center gap-2 transition-colors duration-200 group hover:bg-[#D92D20]/5 mb-3",
              isCollapsed && "px-2"
            )}
          >
            <LogOut className="w-[18px] h-[18px] text-[#D92D20] stroke-[2.5]" />
            {!isCollapsed && (
              <span className="font-bold text-[15px]">Logout</span>
            )}
          </button>
          
          {!isCollapsed && (
            <p className="text-[13px] text-[#6B717B] font-medium tracking-wide">
              Copyright@app
            </p>
          )}
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
