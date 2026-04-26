"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, CreditCard, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { registerMahasiswaAction } from '@/server/auth-actions';
import { toast } from 'sonner';

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  
  // States for password visibility
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const nim = formData.get('nim') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // Field Validations
    if (!name || name.length < 3) {
      toast.error('Nama lengkap harus terdiri dari minimal 3 karakter.');
      return;
    }

    if (!nim || nim.length < 5) {
      toast.error('NIM/NIP tidak valid.');
      return;
    }

    if (!email || !email.includes('@')) {
      toast.error('Format email tidak valid.');
      return;
    }

    if (!password || password.length < 8) {
      toast.error('Password harus terdiri dari minimal 8 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Password dan Konfirmasi Password tidak cocok.');
      return;
    }

    setLoading(true);

    const result = await registerMahasiswaAction(formData);

    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    } else if (result?.success) {
      toast.success(result.message || 'Registrasi berhasil! Mengalihkan ke halaman masuk...');
      // A small delay allows the user to read the toast before redirect
      setTimeout(() => {
        router.push('/sign-in');
      }, 1500);
    }
  };

  return (
    <div className="bg-white rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.06)] p-8 md:p-12 border border-gray-50/50 relative overflow-hidden my-8">
      
      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#50c878] to-[#006400]" />

      <div className="mb-8">
        <h2 className="text-[28px] font-bold text-[#1a1a1a] mb-2 tracking-tight">
          Buat Akun Baru
        </h2>
        <p className="text-gray-500 text-base">
          Lengkapi data di bawah untuk mendaftar
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Full Name Field */}
        <div className="space-y-2.5">
          <label className="text-[14px] font-semibold text-[#1a1a1a]">Nama Lengkap</label>
          <div className="relative flex items-center">
            <User className="absolute left-4 h-5 w-5 text-gray-400" />
            <input 
              name="name"
              type="text" 
              
              placeholder="Masukkan nama lengkap" 
              className="w-full bg-[#f3f4f6] text-gray-800 placeholder-gray-400 text-[15px] rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#50c878]/50 focus:bg-white border text-base border-transparent transition-all"
            />
          </div>
        </div>

        {/* NIM Field */}
        <div className="space-y-2.5">
          <label className="text-[14px] font-semibold text-[#1a1a1a]">NIM / NIP</label>
          <div className="relative flex items-center">
            <CreditCard className="absolute left-4 h-5 w-5 text-gray-400" />
            <input 
              name="nim"
              type="text" 
              
              placeholder="Masukkan identitas akademik" 
              className="w-full bg-[#f3f4f6] text-gray-800 placeholder-gray-400 text-[15px] rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#50c878]/50 focus:bg-white border text-base border-transparent transition-all"
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-2.5">
          <label className="text-[14px] font-semibold text-[#1a1a1a]">Email Institusi</label>
          <div className="relative flex items-center">
            <Mail className="absolute left-4 h-5 w-5 text-gray-400" />
            <input 
              name="email"
              type="email" 
              
              placeholder="email@kampus.ac.id" 
              className="w-full bg-[#f3f4f6] text-gray-800 placeholder-gray-400 text-[15px] rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#50c878]/50 focus:bg-white border text-base border-transparent transition-all"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2.5">
            <label className="text-[14px] font-semibold text-[#1a1a1a]">Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 h-5 w-5 text-gray-400" />
              <input 
                name="password"
                type={showPassword ? "text" : "password"} 
                
                placeholder="Buat sandi" 
                className="w-full bg-[#f3f4f6] text-gray-800 placeholder-gray-400 text-[15px] rounded-xl pl-12 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#50c878]/50 focus:bg-white border text-base border-transparent transition-all"
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
          <div className="space-y-2.5">
            <label className="text-[14px] font-semibold text-[#1a1a1a]">Konfirmasi</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 h-5 w-5 text-gray-400" />
              <input 
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"} 
                
                placeholder="Ulangi sandi" 
                className="w-full bg-[#f3f4f6] text-gray-800 placeholder-gray-400 text-[15px] rounded-xl pl-12 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#50c878]/50 focus:bg-white border text-base border-transparent transition-all"
              />
              <button 
                type="button" 
                className="absolute right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button 
          type="submit"
          disabled={loading}
          className="w-full bg-[#006400] hover:bg-[#004d00] text-white rounded-xl h-14 text-[16px] font-semibold transition-all shadow-md mt-6 disabled:opacity-70"
        >
          {loading ? 'Memproses...' : 'Daftar Akun'}
        </Button>

      </form>

      {/* Helper text linking to login */}
      <div className="mt-8 text-center text-[14px] text-gray-500">
        Sudah punya akun?{' '}
        <Link href="/sign-in" className="text-[#50c878] font-bold hover:underline">
          Masuk di sini
        </Link>
      </div>

    </div>
  );
}
