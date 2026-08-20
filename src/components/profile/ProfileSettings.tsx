"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Camera, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useUploadImageMutation,
} from "@/features/profile/profileApi";

const inputCls = "h-11 rounded-xl border text-sm px-4 focus-visible:ring-1 focus-visible:ring-[#0094DA] focus-visible:border-[#0094DA]";
const inputStyle = { borderColor: "#E5E7EB", color: "#2C2E33", backgroundColor: "#FAFAFA" };

const DEFAULT_AVATAR = "/images/auth/image.png";

export default function ProfileSettings() {
  const { data: profileRes, isLoading, isFetching } = useGetMyProfileQuery(undefined);
  const [updateProfile, { isLoading: isUpdating }] = useUpdateMyProfileMutation();
  const [uploadImage, { isLoading: isUploadingImage }] = useUploadImageMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const profile = profileRes?.data;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [imageUrl, setImageUrl] = useState("");

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

  const handleSave = async () => {
    try {
      const payload: Record<string, any> = {
        firstName,
        lastName,
        phone: {
          countryCode: countryCode || "+1",
          number: phoneNumber,
        },
        address,
        location: profile?.location || {
          type: "Point",
          coordinates: [-122.4194, 37.7749],
        },
        isNotificationEnabled: profile?.isNotificationEnabled ?? true,
      };

      if (isValidUrl(imageUrl)) {
        payload.image = imageUrl;
      }

      const res = await updateProfile(payload).unwrap();
      toast.success(res?.message || "Profile updated successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || "Failed to update profile.");
    }
  };

  const currentAvatar = imageUrl || profile?.image || DEFAULT_AVATAR;

  return (
    <div className="max-w-4xl space-y-6 pb-5 relative">
      {(isLoading || isFetching) && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-xs flex items-center justify-center z-30 min-h-[300px] rounded-xl">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-[#0094DA] animate-spin" />
            <p className="text-xs font-semibold text-gray-500">Loading profile data...</p>
          </div>
        </div>
      )}

      {/* ── Personal Information Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-4 sm:p-8 space-y-6 sm:space-y-8 border border-gray-100"
      >
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
          <div className="relative group">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden relative border-4 border-white shadow-sm bg-gray-100">
              <Image
                src={currentAvatar}
                alt="Admin Profile"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <button
              disabled={isUploadingImage}
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0094DA] flex items-center justify-center text-white border-2 border-white shadow-sm hover:scale-105 transition-transform cursor-pointer disabled:opacity-50"
            >
              {isUploadingImage ? (
                <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
              ) : (
                <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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

          <div className="space-y-2 sm:space-y-3">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                {firstName} {lastName}
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-[#0094DA] capitalize mt-0.5">
                {profile?.role ? profile.role.replace("_", " ") : "Administrator"}
              </p>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 pt-2 border-t border-gray-100">
          <div className="space-y-1.5 flex flex-col">
            <Label className="text-xs font-bold text-gray-700 uppercase tracking-wider">First Name</Label>
            <Input
              className={inputCls}
              style={inputStyle}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter first name"
            />
          </div>

          <div className="space-y-1.5 flex flex-col">
            <Label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Last Name</Label>
            <Input
              className={inputCls}
              style={inputStyle}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter last name"
            />
          </div>

          <div className="space-y-1.5 flex flex-col md:col-span-2">
            <Label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email Address (Read Only)</Label>
            <Input
              className={`${inputCls} opacity-70 cursor-not-allowed`}
              style={inputStyle}
              value={email}
              disabled
            />
          </div>

          <div className="space-y-1.5 flex flex-col">
            <Label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Phone Country Code</Label>
            <Input
              className={inputCls}
              style={inputStyle}
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              placeholder="+1"
            />
          </div>

          <div className="space-y-1.5 flex flex-col">
            <Label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Phone Number</Label>
            <Input
              className={inputCls}
              style={inputStyle}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number"
            />
          </div>

          <div className="space-y-1.5 flex flex-col md:col-span-2">
            <Label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Address</Label>
            <Input
              className={inputCls}
              style={inputStyle}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter address"
            />
          </div>
        </div>
      </motion.div>

      {/* ── Footer Action Card ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 border border-gray-100"
      >
        <Button
          disabled={isUpdating}
          onClick={handleSave}
          className="h-11 px-8 rounded-xl font-bold text-white cursor-pointer bg-[#0094DA] hover:bg-[#007BB5] transition-colors shadow-lg shadow-[#0094DA]/20 flex items-center justify-center gap-2"
        >
          {isUpdating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Save Changes"
          )}
        </Button>
      </motion.div>
    </div>
  );
}

