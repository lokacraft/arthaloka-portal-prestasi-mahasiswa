"use client";

import React, { useEffect, useState } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WelcomeDialog() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show after a tiny delay for smooth entry
    const timer = setTimeout(() => setIsOpen(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-in zoom-in-95 duration-300"
        role="dialog"
      >
        <div className="flex flex-col items-center text-center">
          <div className="h-16 w-16 bg-[#e6f4ea] text-[#50c878] rounded-full flex items-center justify-center mb-6">
            <Info className="h-8 w-8" strokeWidth={2.5} />
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">
            Selamat Datang!
          </h2>
          
          <p className="text-gray-500 text-[15px] leading-relaxed mb-8">
            Laporkan prestasi akademik dan non-akademik Anda melalui portal ini. 
            Semua pengajuan akan diverifikasi oleh Admin Kemahasiswaan sebelum disetujui.
          </p>

          <Button 
            onClick={() => setIsOpen(false)}
            className="w-full bg-[#006400] hover:bg-[#004d00] text-white rounded-xl h-12 text-[15px] font-semibold transition-all shadow-sm"
          >
            Mengerti
          </Button>
        </div>
      </div>
    </div>
  );
}
