"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleConfirmLogout = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    dispatch(logout());
    toast.success("Logged out successfully");
    setIsLoading(false);
    onClose();
    router.push("/auth/login");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open && !isLoading) onClose(); }}>
      <DialogContent className="sm:max-w-lg bg-white p-6 rounded-2xl shadow-2xl border border-gray-100">
        <DialogHeader className="flex flex-col items-center text-center gap-2">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-1 ring-8 ring-red-50/50">
            <LogOut className="w-7 h-7 stroke-[2.2]" />
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Confirm Logout
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 text-center max-w-[280px]">
            Are you sure you want to log out of your account?
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={onClose}
            className="flex-1 h-11 border-gray-200 hover:bg-gray-100 text-gray-700 font-semibold rounded-xl transition-all cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={isLoading}
            onClick={handleConfirmLogout}
            className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Logging out...</span>
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
