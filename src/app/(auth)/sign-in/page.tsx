"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signIn } from '@/lib/auth-client';
import { toast } from 'sonner';

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Basic Validation
    if (!email || !email.includes('@')) {
      toast.error('Format email tidak valid.');
      return;
    }

    if (!password || password.length < 8) {
      toast.error('Password harus minimal 8 karakter.');
      return;
    }

    setLoading(true);

    const { error: signInError } = await signIn.email({
      email,
      password,
    });

    if (signInError) {
      toast.error(signInError.message || 'Gagal masuk. Periksa email dan password Anda.');
      setLoading(false);
    } else {
      toast.success('Berhasil masuk! Mengalihkan ke dashboard...');
      router.push('/dashboard');
    }
  };

  return (
    <div className="bg-white rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.06)] p-8 md:p-12 border border-gray-50/50 relative overflow-hidden">
      
      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#50c878] to-[#006400]" />

      <div className="mb-8">
        <div className="bg-[#50c878] w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
          <GraduationCap className="h-7 w-7 text-white" strokeWidth={2.5} />
        </div>
        <h2 className="text-[28px] font-bold text-[#1a1a1a] mb-2 tracking-tight">
          Selamat Datang
        </h2>
        <p className="text-gray-500 text-base">
          Masuk ke akun Anda untuk melanjutkan
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Email Field */}
        <div className="space-y-2.5">
          <label className="text-[15px] font-semibold text-[#1a1a1a]">Email Institusi</label>
          <div className="relative flex items-center">
            <Mail className="absolute left-4 h-5 w-5 text-gray-400" />
            <input 
              name="email"
              type="email" 
              required
              placeholder="Masukkan Email" 
              className="w-full bg-[#f3f4f6] text-gray-800 placeholder-gray-400 text-[15px] rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#50c878]/50 focus:bg-white border text-base border-transparent transition-all"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2.5">
          <label className="text-[15px] font-semibold text-[#1a1a1a]">Password</label>
          <div className="relative flex items-center">
            <Lock className="absolute left-4 h-5 w-5 text-gray-400" />
            <input 
              name="password"
              type={showPassword ? "text" : "password"} 
              required
              placeholder="Masukkan password" 
              className="w-full bg-[#f3f4f6] text-gray-800 placeholder-gray-400 text-[15px] rounded-xl pl-12 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-[#50c878]/50 focus:bg-white border text-base border-transparent transition-all"
            />
            <button 
              type="button" 
              className="absolute right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Forgot Password */}
        <div className="flex justify-end pt-1 pb-2">
          <Link href="/forgot-password" className="text-[#50c878] hover:text-[#3da963] font-medium text-[14px] transition-colors">
            Lupa Password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button 
          type="submit"
          disabled={loading}
          className="w-full bg-[#006400] hover:bg-[#004d00] text-white rounded-xl h-14 text-[16px] font-semibold transition-all shadow-md mt-2 disabled:opacity-70"
        >
          {loading ? 'Memproses...' : 'Masuk'}
        </Button>

      </form>

      {/* Helper text linking to register */}
      <div className="mt-8 text-center text-[14px] text-gray-500">
        Belum punya akun?{' '}
        <Link href="/sign-up" className="text-[#50c878] font-bold hover:underline">
          Registrasi
        </Link>
      </div>

    </div>
  );
}
