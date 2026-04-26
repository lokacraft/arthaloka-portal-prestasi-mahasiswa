import React from 'react';
import Link from 'next/link';
import { MailOpen, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AcceptInvitePage() {
  return (
    <div className="bg-white rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.06)] p-8 md:p-12 border border-gray-50/50 relative overflow-hidden my-8">
      
      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#50c878] to-[#006400]" />

      <div className="mb-8">
        <div className="bg-amber-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
          <MailOpen className="h-7 w-7 text-amber-600" strokeWidth={2.5} />
        </div>
        <h2 className="text-[28px] font-bold text-[#1a1a1a] mb-2 tracking-tight">
          Klaim Akun Undangan
        </h2>
        <p className="text-gray-500 text-base">
          Selesaikan pendaftaran Anda sebagai <span className="font-semibold text-gray-800">Admin</span> dengan membuat password baru.
        </p>
      </div>

      <form className="space-y-5">
        
        {/* Password Field */}
        <div className="space-y-2.5">
          <label className="text-[14px] font-semibold text-[#1a1a1a]">Password Baru</label>
          <div className="relative flex items-center">
            <Lock className="absolute left-4 h-5 w-5 text-gray-400" />
            <input 
              type="password" 
              placeholder="Buat sandi yang kuat" 
              className="w-full bg-[#f3f4f6] text-gray-800 placeholder-gray-400 text-[15px] rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#50c878]/50 focus:bg-white border text-base border-transparent transition-all"
            />
          </div>
        </div>

        {/* Konfirmasi Password Field */}
        <div className="space-y-2.5">
          <label className="text-[14px] font-semibold text-[#1a1a1a]">Konfirmasi Password</label>
          <div className="relative flex items-center">
            <Lock className="absolute left-4 h-5 w-5 text-gray-400" />
            <input 
              type="password" 
              placeholder="Ulangi sandi" 
              className="w-full bg-[#f3f4f6] text-gray-800 placeholder-gray-400 text-[15px] rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#50c878]/50 focus:bg-white border text-base border-transparent transition-all"
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button 
          className="w-full bg-[#006400] hover:bg-[#004d00] text-white rounded-xl h-14 text-[16px] font-semibold transition-all shadow-md mt-6"
        >
          Simpan Sandi & Masuk
        </Button>

      </form>

      {/* Helper text */}
      <div className="mt-8 text-center text-[14px] text-gray-400">
        Pastikan untuk menjaga kerahasiaan password Anda demi keamanan portal.
      </div>

    </div>
  );
}
