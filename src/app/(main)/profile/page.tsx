"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "react-hot-toast";
import {
  Camera,
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Globe,
} from "lucide-react";
import {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useChangeMyPasswordMutation,
  useUploadImageMutation,
} from "@/features/profile/profileApi";

export default function ProfilePage() {
  // RTK Query Hooks
  const { data: profileRes, isLoading, isFetching } = useGetMyProfileQuery(undefined);
  const [updateMyProfile, { isLoading: isUpdatingProfile }] = useUpdateMyProfileMutation();
  const [changeMyPassword, { isLoading: isUpdatingPassword }] = useChangeMyPasswordMutation();
  const [uploadImage, { isLoading: isUploadingImage }] = useUploadImageMutation();

  const profile = profileRes?.data;

  // Profile Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync profile data when fetched
  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setEmail(profile.email || "");
      setCountryCode(profile.phone?.countryCode || "+1");
      setPhoneNumber(profile.phone?.number || "");
      setAddress(profile.address || "");
      setImageUrl(profile.image || "");
    }
  }, [profile]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const toastId = toast.loading("Uploading profile image...");
    try {
      const res = await uploadImage(formData).unwrap();
      const uploadedUrl = res?.data?.images?.[0];

      if (uploadedUrl) {
        setImageUrl(uploadedUrl);
        toast.success(res?.message || "File uploaded successfully", { id: toastId });
      } else {
        toast.error("Could not retrieve image URL from upload response", { id: toastId });
      }
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || "Failed to upload image", { id: toastId });
    }
  };

  const isValidUrl = (urlStr: string) => {
    return typeof urlStr === "string" && (urlStr.startsWith("http://") || urlStr.startsWith("https://"));
  };

  const handleUpdateProfile = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("First name and last name are required");
      return;
    }

    try {
      const payload: Record<string, any> = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: {
          countryCode: countryCode.trim() || "+1",
          number: phoneNumber.trim(),
        },
        address: address.trim(),
        location: profile?.location || {
          type: "Point",
          coordinates: [-122.4194, 37.7749],
        },
        isNotificationEnabled: profile?.isNotificationEnabled ?? true,
      };

      if (isValidUrl(imageUrl)) {
        payload.image = imageUrl;
      }

      const res = await updateMyProfile(payload).unwrap();
      toast.success(res?.message || "Profile updated successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || "Failed to update profile");
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      const payload = {
        currentPassword,
        newPassword,
        confirmPassword,
      };

      const res = await changeMyPassword(payload).unwrap();
      toast.success(res?.message || "Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || "Failed to change password");
    }
  };

  const userInitials = `${firstName ? firstName[0] : "A"}${lastName ? lastName[0] : "D"}`.toUpperCase();

  return (
    <div className="container mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      {(isLoading || isFetching) && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-xs flex items-center justify-center z-30 min-h-[400px] rounded-2xl">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-[#0094DA] animate-spin" />
            <p className="text-xs font-semibold text-gray-500">Loading profile data...</p>
          </div>
        </div>
      )}

      <div className="space-y-1 mb-8 sm:mb-10 pt-1 sm:pt-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">My Profile</h1>
        <p className="text-sm sm:text-base text-gray-500 font-normal">Manage your account information and security settings.</p>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* Profile Info Section */}
        <section className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-8 border border-gray-100 space-y-8 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-center">
            {/* Avatar Upload */}
            <div className="relative group shrink-0">
              <Avatar className="w-28 h-28 sm:w-32 sm:h-32 border-4 border-white shadow-xl bg-gray-100">
                <AvatarImage src={imageUrl || ""} />
                <AvatarFallback className="bg-[#0094DA]/10 text-[#0094DA] text-2xl sm:text-3xl font-bold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <button
                disabled={isUploadingImage}
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 bg-[#0094DA] text-white p-2 sm:p-2.5 rounded-full shadow-lg hover:bg-[#007BB5] transition-all transform hover:scale-110 active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isUploadingImage ? (
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
            </div>

            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111827]">
                {firstName} {lastName}
              </h2>
              <p className="text-sm sm:text-base text-gray-500 flex items-center justify-center sm:justify-start gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                {email || "admin@rizipt.com"}
              </p>
              <p className="text-xs font-semibold text-[#0094DA] capitalize mt-1">
                Role: {profile?.role ? profile.role.replace("_", " ") : "Administrator"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 pt-4 border-t border-gray-100">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">First Name</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className="pl-11 sm:pl-12 h-12 bg-gray-50/50 border-gray-200 rounded-xl text-sm sm:text-base focus:bg-white focus:ring-2 focus:ring-[#0094DA]/30 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Last Name</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  className="pl-11 sm:pl-12 h-12 bg-gray-50/50 border-gray-200 rounded-xl text-sm sm:text-base focus:bg-white focus:ring-2 focus:ring-[#0094DA]/30 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Email Address (Read Only)</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <Input
                  type="email"
                  value={email}
                  disabled
                  className="pl-11 sm:pl-12 h-12 bg-gray-100 border-gray-200 rounded-xl text-sm sm:text-base text-gray-500 opacity-80 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Phone Country Code</Label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <Input
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  placeholder="+1"
                  className="pl-11 sm:pl-12 h-12 bg-gray-50/50 border-gray-200 rounded-xl text-sm sm:text-base focus:bg-white focus:ring-2 focus:ring-[#0094DA]/30 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <Input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Phone number"
                  className="pl-11 sm:pl-12 h-12 bg-gray-50/50 border-gray-200 rounded-xl text-sm sm:text-base focus:bg-white focus:ring-2 focus:ring-[#0094DA]/30 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Address</Label>
              <div className="relative">
                <MapPin className="absolute left-4 top-5 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <Textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter full street address"
                  className="pl-11 sm:pl-12 pt-4 min-h-[90px] bg-gray-50/50 border-gray-200 rounded-xl text-sm sm:text-base focus:bg-white focus:ring-2 focus:ring-[#0094DA]/30 transition-all resize-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              disabled={isUpdatingProfile}
              onClick={handleUpdateProfile}
              className="w-full sm:w-auto bg-[#0094DA] hover:bg-[#007BB5] text-white px-8 sm:px-10 h-11 sm:h-12 rounded-xl text-sm sm:text-base font-bold shadow-lg shadow-[#0094DA]/20 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isUpdatingProfile ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Update Profile"
              )}
            </button>
          </div>
        </section>

        {/* Password Section */}
        <section className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-8 border border-gray-100 space-y-6 shadow-sm">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#111827] flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[#0094DA]" />
                  Change Password
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Update your password to keep your account secure.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 pb-2">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Current Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="pl-11 sm:pl-12 pr-12 h-12 bg-gray-50/50 border-gray-200 rounded-xl text-sm sm:text-base focus:bg-white focus:ring-2 focus:ring-[#0094DA]/30 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="pl-11 sm:pl-12 pr-12 h-12 bg-gray-50/50 border-gray-200 rounded-xl text-sm sm:text-base focus:bg-white focus:ring-2 focus:ring-[#0094DA]/30 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="pl-11 sm:pl-12 pr-12 h-12 bg-gray-50/50 border-gray-200 rounded-xl text-sm sm:text-base focus:bg-white focus:ring-2 focus:ring-[#0094DA]/30 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                disabled={isUpdatingPassword}
                onClick={handleUpdatePassword}
                className="w-full sm:w-auto bg-[#0094DA] hover:bg-[#007BB5] text-white px-8 sm:px-10 h-11 sm:h-12 rounded-xl text-sm sm:text-base font-bold shadow-lg shadow-[#0094DA]/20 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isUpdatingPassword ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Update Password"
                )}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
