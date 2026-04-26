import React from 'react';
import { GraduationCap, CheckCircle2, Clock } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex w-full font-sans">
      
      {/* Left Panel - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-[#eafaf1] to-[#d1f2d9] items-center justify-center p-12 overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#50c878]/10 blur-3xl mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#50c878]/20 blur-3xl mix-blend-multiply" />

        <div className="relative z-10 max-w-lg text-center flex flex-col items-center">
          {/* Logo / Icon */}
          <div className="bg-white p-4 rounded-2xl shadow-sm mb-8 inline-block">
            <GraduationCap className="h-12 w-12 text-[#50c878]" strokeWidth={2} />
          </div>
          
          {/* Typography */}
          <h1 className="text-4xl font-extrabold text-[#1a1a1a] mb-2 font-sans tracking-tight">
            Portal Prestasi
          </h1>
          <h2 className="text-4xl font-bold text-[#50c878] mb-6 tracking-tight">
            Mahasiswa
          </h2>
          
          <p className="text-[#6b7280] text-lg leading-relaxed mb-12">
            Platform terpadu untuk melaporkan pencapaian akademik dan non-akademik,
            verifikasi admin, dan analitik akreditasi institusi.
          </p>

          {/* Abstract Illustration / Floating Badges representation */}
          <div className="relative w-full h-[250px] flex items-center justify-center">
            {/* Center abstract trophy generic representation */}
            <div className="relative w-32 h-32 bg-gradient-to-t from-[#fde68a] to-[#fbbf24] rounded-full shadow-xl flex items-center justify-center ring-8 ring-white/50 backdrop-blur-sm">
               <GraduationCap className="w-16 h-16 text-white" />
            </div>

            {/* Floating Badge 1 */}
            <div className="absolute left-0 top-[20%] bg-white px-4 py-2 rounded-xl shadow-lg border border-gray-100 flex items-center gap-2 animate-bounce transition-all [animation-duration:3s]">
              <CheckCircle2 className="w-4 h-4 text-[#50c878]" />
              <span className="text-sm font-semibold text-gray-700">Prestasi Valid</span>
            </div>

            {/* Floating Badge 2 */}
            <div className="absolute right-0 bottom-[20%] bg-white px-4 py-2 rounded-xl shadow-lg border border-gray-100 flex items-center gap-2 animate-bounce transition-all [animation-duration:4s]">
              <Clock className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold text-gray-700">Menunggu Verifikasi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form (Fluid width) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#f8f9fa] relative">
        <div className="w-full max-w-[500px]">
          {children}
        </div>
      </div>
      
    </div>
  );
}
