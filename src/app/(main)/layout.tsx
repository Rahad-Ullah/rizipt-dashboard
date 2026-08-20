import type { Metadata } from "next";
import OptimusSidebar from "@/components/appSidebar/AppsideBar";
import Header from "@/components/header/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import "../globals.css";

export const metadata: Metadata = {
  title: "RIZIPT Receipt Scanner Admin Dashboard",
  description: "RIZIPT Receipt Scanner Admin Dashboard for Future Pharmacy",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <OptimusSidebar />
        <SidebarInset className="bg-gray-100 flex flex-col overflow-hidden h-screen">
          <Header />
          <main className="flex-1 p-4 md:p-8 overflow-y-auto min-w-0 flex flex-col">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
