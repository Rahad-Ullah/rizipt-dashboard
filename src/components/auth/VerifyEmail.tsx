"use client";

import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';

import { motion } from 'framer-motion';
import { useForgotEmailOTPCheckMutation, useResendPasswordMutation } from '@/features/auth/authApi';

export default function VerifyEmail() {
  const [otp, setOtp] = useState<string>('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const [verifyOTP, { isLoading }] = useForgotEmailOTPCheckMutation();
  const [resendOTP, { isLoading: isResending }] = useResendPasswordMutation();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!otp || otp.trim().length === 0) {
      toast.error('Please enter the verification code');
      return;
    }

    if (!email) {
      toast.error('Email parameter missing. Please request a new OTP.');
      return;
    }

    const oneTimeCode = Number(otp);
    if (isNaN(oneTimeCode)) {
      toast.error('Invalid OTP code');
      return;
    }

    try {
      const res = await verifyOTP({ email, oneTimeCode }).unwrap();
      if (res?.success) {
        toast.success(res?.message || 'Verification Successful!');
        const resetToken = res?.data?.resetToken || res?.data;
        setTimeout(() => {
          router.push(`/auth/reset-password?token=${encodeURIComponent(resetToken)}&email=${encodeURIComponent(email)}`);
        }, 1000);
      } else {
        toast.error(res?.message || 'Verification failed!');
      }
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Invalid or expired OTP code.');
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error('Email is missing');
      return;
    }
    try {
      const res = await resendOTP({ email }).unwrap();
      if (res?.success) {
        toast.success(res?.message || 'Please check your email. We have sent you a one-time passcode (OTP).');
      } else {
        toast.error(res?.message || 'Failed to resend OTP.');
      }
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to resend OTP.');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#DFDFDF] font-sans">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-black/5">
        <Image
          src="/images/auth/image.png"
          alt="Auth Background"
          fill
          quality={100}
          className="object- w-full"
          priority
        />
      </div>

      {/* Right Side - Form with Bubbles Background */}
      <div className="w-full lg:w-1/2 relative flex items-center justify-center p-4 sm:p-8 lg:p-12 overflow-hidden bg-white/10">
        
        {/* Decorative Bubbles at Bottom Right */}
        <div className="absolute -bottom-24 -right-16 w-[400px] h-[400px] bg-gradient-to-t from-[#0094DA] to-[#87c5f9] rounded-full opacity-60 mix-blend-multiply blur-[2px]"></div>
        <div className="absolute -bottom-10 right-32 w-72 h-72 bg-gradient-to-t from-[#2da6ec] to-[#a8defa] rounded-full opacity-70 mix-blend-multiply blur-[1px]"></div>
        <div className="absolute bottom-16 -right-10 w-56 h-56 bg-gradient-to-t from-[#52bcfb] to-[#d6f0fe] rounded-full opacity-80 mix-blend-multiply"></div>

        {/* Centered Form Card */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.4 }}
           className="w-full max-w-[540px] z-10 bg-[#F8F9FA] rounded-xl shadow-2xl shadow-black/10 p-8 sm:p-12 relative overflow-hidden ring-1 ring-white/80"
        >
          {/* subtle white highlight on top of card */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/40 to-transparent pointer-events-none rounded-t-xl" />

          <div className="text-center mb-8 relative z-10">
            <div className="flex items-center justify-center mx-auto mb-4">
              <Image src="/icons/logo.png" alt="Logo" width={180} height={70} className="object-contain drop-shadow-sm" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Verify OTP</h2>
            <p className="text-[15px] text-gray-500 font-medium">
              We have sent a verification code to <span className="font-semibold text-gray-700">{email || "your email"}</span>.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 flex flex-col items-center relative z-10">

            <div className="w-full flex justify-center mb-4">
              <InputOTP
                maxLength={4}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup className="gap-2 sm:gap-3">
                  <InputOTPSlot index={0} className="w-11 h-12 sm:w-12 sm:h-14 border-gray-300 rounded-md text-lg bg-transparent focus-visible:ring-1 focus-visible:bg-white focus-visible:ring-[#0094DA]" />
                  <InputOTPSlot index={1} className="w-11 h-12 sm:w-12 sm:h-14 border-gray-300 rounded-md text-lg bg-transparent focus-visible:ring-1 focus-visible:bg-white focus-visible:ring-[#0094DA]" />
                  <InputOTPSlot index={2} className="w-11 h-12 sm:w-12 sm:h-14 border-gray-300 rounded-md text-lg bg-transparent focus-visible:ring-1 focus-visible:bg-white focus-visible:ring-[#0094DA]" />
                  <InputOTPSlot index={3} className="w-11 h-12 sm:w-12 sm:h-14 border-gray-300 rounded-md text-lg bg-transparent focus-visible:ring-1 focus-visible:bg-white focus-visible:ring-[#0094DA]" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !otp || otp.trim().length === 0}
              className="w-full h-12 mt-2 bg-[#00A3FF] hover:bg-[#0094DA] text-white rounded-lg text-[16px] font-semibold transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </Button>

            <div className="text-center text-[14px] text-gray-600 mt-2">
              Didn&apos;t receive the code?{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-[#0094DA] font-semibold hover:underline disabled:opacity-50 transition-colors"
              >
                {isResending ? 'Sending...' : 'Resend'}
              </button>
            </div>

            <div className="mt-4 pt-2 text-center w-full">
              <Link
                href="/auth/login"
                className="text-gray-500 hover:text-[#0094DA] font-medium inline-flex items-center gap-2 group transition-colors text-[14px]"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Login
              </Link>
            </div>

            <div className="text-center mt-6 pt-4 pointer-events-none w-full">
               <p className="text-[13px] text-[#C29B0C] font-semibold tracking-wide">
                 Secure Admin Access • Rizipt &copy; 2026
               </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}


