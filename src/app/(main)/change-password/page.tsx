"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { useChangeMyPasswordMutation } from "@/features/profile/profileApi";

export default function ChangePasswordPage() {
  const [changeMyPassword, { isLoading }] = useChangeMyPasswordMutation();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSave = async () => {
    const newErrors = {
      currentPassword: !formData.currentPassword ? "Current password is required" : "",
      newPassword: !formData.newPassword ? "New password is required" : "",
      confirmPassword: !formData.confirmPassword ? "Confirm password is required" : "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err)) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    try {
      const res = await changeMyPassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      }).unwrap();

      toast.success(res?.message || "Password updated successfully!");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || "Failed to change password.");
    }
  };

  return (
    <div className="max-w-5xl">
      <div className="space-y-1 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2C2E33]">Password Change</h1>
        <div className="pt-3 sm:pt-4">
          <h2 className="text-lg sm:text-xl font-bold text-[#2C2E33]">Choose a New Password</h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Enter and confirm your new password to regain access
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 max-w-4xl"
      >
        {/* Current Password */}
        <div className="space-y-2">
          <Label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Current Password</Label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <Input
              type="password"
              placeholder="Enter your old password"
              value={formData.currentPassword}
              onChange={(e) => handleChange("currentPassword", e.target.value)}
              className={`h-12 sm:h-14 pl-10 sm:pl-12 bg-white border border-gray-200 rounded-xl text-base placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#0094DA]/30 ${errors.currentPassword ? "ring-2 ring-red-500" : ""}`}
            />
          </div>
          <AnimatePresence>
            {errors.currentPassword && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-500 text-xs font-semibold ml-1"
              >
                {errors.currentPassword}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <Label className="text-sm font-bold text-gray-700 uppercase tracking-wider">New Password</Label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <Input
              type="password"
              placeholder="Enter your new password"
              value={formData.newPassword}
              onChange={(e) => handleChange("newPassword", e.target.value)}
              className={`h-12 sm:h-14 pl-10 sm:pl-12 bg-white border border-gray-200 rounded-xl text-base placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#0094DA]/30 ${errors.newPassword ? "ring-2 ring-red-500" : ""}`}
            />
          </div>
          <AnimatePresence>
            {errors.newPassword && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-500 text-xs font-semibold ml-1"
              >
                {errors.newPassword}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Confirm Password</Label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <Input
              type="password"
              placeholder="Re-enter your new password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              className={`h-12 sm:h-14 pl-10 sm:pl-12 bg-white border border-gray-200 rounded-xl text-base placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#0094DA]/30 ${errors.confirmPassword ? "ring-2 ring-red-500" : ""}`}
            />
          </div>
          <AnimatePresence>
            {errors.confirmPassword && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-500 text-xs font-semibold ml-1"
              >
                {errors.confirmPassword}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            disabled={isLoading}
            onClick={handleSave}
            className="w-full sm:w-auto bg-[#0094DA] hover:bg-[#007BB5] text-white px-10 sm:px-16 h-11 sm:h-12 rounded-xl text-base font-bold shadow-lg shadow-[#0094DA]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Password"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}