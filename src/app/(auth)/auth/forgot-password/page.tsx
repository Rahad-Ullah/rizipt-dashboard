"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ArrowLeft, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';

import { motion } from 'framer-motion';
import { useForgotEmailMutation } from '@/features/auth/authApi';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});

  const router = useRouter();
  const [forgotEmail, { isLoading }] = useForgotEmailMutation();

  const validate = () => {
    const newErrors: { email?: string } = {};

    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      const res = await forgotEmail({ email }).unwrap();
      if (res?.success) {
        setIsSuccess(true);
        toast.success(res?.message || 'Please check your email. We have sent you a one-time passcode (OTP).');

        setTimeout(() => {
          router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
        }, 1000);
      } else {
        toast.error(res?.message || 'Failed to send OTP code.');
      }
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Something went wrong.');
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

      {/* Right Side - Login Form with Bubbles Background */}
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
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Forgot Password</h2>
            <p className="text-[15px] text-gray-500 font-medium">Enter your registered email to receive an OTP.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Email Address</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-800">
                  <Mail className="w-[18px] h-[18px] stroke-[1.5]" />
                </div>
                <Input
                  type="email"
                  placeholder="admin@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  disabled={isLoading || isSuccess}
                  className={cn(
                    "h-[50px] pl-11 bg-transparent border-gray-300 rounded-lg focus-visible:ring-1 focus-visible:bg-white transition-all text-[15px] placeholder:text-gray-400",
                    errors.email ? "focus-visible:ring-red-500 border-red-300 bg-red-50/30" : "focus-visible:ring-[#0094DA] focus-visible:border-[#0094DA]"
                  )}
                />
              </div>
              {errors.email && (
                <p className="text-xs font-medium text-red-500 mt-1 ml-1 animate-in fade-in slide-in-from-top-1">
                  {errors.email}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading || isSuccess}
              className="w-full h-12 mt-2 bg-[#00A3FF] hover:bg-[#0094DA] text-white rounded-lg text-[16px] font-semibold transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              {isLoading ? 'Sending...' : isSuccess ? 'Code Sent!' : 'Send Reset Link'}
            </Button>

            <div className="mt-6 pt-2 text-center">
              <Link
                href="/auth/login"
                className="text-gray-500 hover:text-[#0094DA] font-medium inline-flex items-center gap-2 group transition-colors text-[14px]"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Login
              </Link>
            </div>

            <div className="text-center mt-8 pt-4 pointer-events-none">
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


