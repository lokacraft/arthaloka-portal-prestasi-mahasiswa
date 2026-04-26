import React from "react";
import Link from "next/link";
import { ArrowRight, Trophy, Award, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fdfa] to-[#e6f7ed] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-3xl w-full flex flex-col items-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Logo/Icon Group */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          <div className="h-16 w-16 bg-[#50c878] rounded-2xl flex items-center justify-center shadow-lg shadow-[#50c878]/30 rotate-12 transition-transform hover:rotate-0">
            <Trophy className="h-8 w-8 text-white" strokeWidth={2.5} />
          </div>
          <div className="h-12 w-12 bg-[#006400] rounded-full flex items-center justify-center shadow-lg shadow-[#006400]/20 -translate-y-4">
            <Award className="h-6 w-6 text-white" strokeWidth={2.5} />
          </div>
          <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-gray-100 -rotate-6 transition-transform hover:rotate-0">
            <Star className="h-7 w-7 text-[#50c878]" fill="#50c878" />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold text-[#1a1a1a] tracking-tight leading-tight">
            Portal Prestasi <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#006400] to-[#50c878]">
              Mahasiswa
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Sistem terintegrasi untuk mendata, memvalidasi, dan mengapresiasi
            setiap pencapaian luar biasa Anda selama menjadi mahasiswa.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full pt-8">
          <Link href="/sign-in" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto h-14 px-8 text-base font-semibold rounded-full bg-[#006400] hover:bg-[#004d00] shadow-xl shadow-[#006400]/20 transition-all hover:scale-105 group">
              Mulai Sekarang
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>

          <Link href="/sign-up" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto h-14 px-8 text-base font-semibold rounded-full border-2 border-[#50c878] text-[#006400] hover:bg-[#50c878]/10 transition-all"
            >
              Daftar Akun Baru
            </Button>
          </Link>
        </div>

        {/* Footer info */}
        <div className="pt-16 text-sm text-gray-500 font-medium">
          Dikelola oleh Direktorat Kemahasiswaan
        </div>
      </div>
    </div>
  );
}
