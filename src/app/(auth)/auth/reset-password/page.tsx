"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, Suspense, useState } from 'react';
import toast from 'react-hot-toast';

import { motion } from 'framer-motion';

function ResetPasswordContent() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});

  const router = useRouter();
  const searchParams = useSearchParams();
  console.log(searchParams)

  const validate = () => {
    const newErrors: { password?: string; confirmPassword?: string } = {};

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Password reset successfully!');

      // Redirect to login
      setTimeout(() => {
        router.push('/auth/login');
      }, 1500);
    }, 1500);
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
          className="object-c w-full"
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
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Set a new password</h2>
            <p className="text-[15px] text-gray-500 font-medium">Your new password must be different.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">New Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-800">
                  <Lock className="w-[18px] h-[18px] stroke-[1.5]" />
                </div>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create new password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: undefined });
                  }}
                  className={cn(
                    "h-[50px] pl-11 pr-11 bg-transparent border-gray-300 rounded-lg focus-visible:ring-1 focus-visible:bg-white transition-all text-[15px] placeholder:text-gray-400 tracking-wider",
                    errors.password ? "focus-visible:ring-red-500 border-red-300 bg-red-50/30" : "focus-visible:ring-[#0094DA] focus-visible:border-[#0094DA]"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs font-medium text-red-500 mt-1 ml-1 animate-in fade-in slide-in-from-top-1">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Confirm Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-800">
                  <Lock className="w-[18px] h-[18px] stroke-[1.5]" />
                </div>
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                  }}
                  className={cn(
                    "h-[50px] pl-11 pr-11 bg-transparent border-gray-300 rounded-lg focus-visible:ring-1 focus-visible:bg-white transition-all text-[15px] placeholder:text-gray-400 tracking-wider",
                    errors.confirmPassword ? "focus-visible:ring-red-500 border-red-300 bg-red-50/30" : "focus-visible:ring-[#0094DA] focus-visible:border-[#0094DA]"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs font-medium text-red-500 mt-1 ml-1 animate-in fade-in slide-in-from-top-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 mt-4 bg-[#00A3FF] hover:bg-[#0094DA] text-white rounded-lg text-[16px] font-semibold transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>

            <div className="mt-6 pt-2 text-center w-full">
              <Link
                href="/auth/login"
                className="text-gray-500 hover:text-[#0094DA] font-medium inline-flex items-center gap-2 group transition-colors text-[14px]"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Login
              </Link>
            </div>

            <div className="text-center mt-8 pt-4 pointer-events-none w-full">
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


export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

