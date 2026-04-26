"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Camera, Shield, Smartphone, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogOverlay, DialogPortal } from '@/components/ui/dialog';

export function PengaturanContent() {
  const router = useRouter();
  const [mfaModalOpen, setMfaModalOpen] = useState(false);
  const [is2FaEnabled, setIs2FaEnabled] = useState(false);

  const handle2FaToggle = (checked: boolean) => {
    if (checked) setMfaModalOpen(true);
    else setIs2FaEnabled(false);
  };

  return (
    <div className="flex flex-col gap-6 pb-8 font-sans animate-in fade-in duration-500">
      <div>
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-[#50c878] hover:text-[#006400] font-medium text-[15px] transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" />Kembali
        </button>
        <h1 className="text-[28px] font-bold text-[#1a1a1a] tracking-tight">Pengaturan Akun</h1>
        <p className="text-gray-500 text-[15px] mt-1">Kelola informasi pribadi dan keamanan akun Anda</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6 md:p-8">
        <h2 className="text-[18px] font-semibold text-[#1a1a1a] mb-8">Informasi Profil</h2>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-[#50c878] text-white flex items-center justify-center text-4xl font-semibold">A</div>
            <button className="absolute bottom-0 right-0 bg-white border border-gray-200 rounded-full p-2 hover:bg-gray-50 shadow-sm transition-colors text-gray-600">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div>
            <h3 className="text-[20px] font-bold text-gray-900">Ahmad Rizki</h3>
            <p className="text-[14px] text-gray-500 mt-1">ahmad.rizki@telkomuniversity.ac.id</p>
            <p className="text-[14px] text-gray-500">NIM: 1234567890</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {[
            { label: 'Nama Lengkap', val: 'Ahmad Rizki', disabled: false },
            { label: 'NIM / ID', val: '1234567890', disabled: true },
            { label: 'Email', val: 'ahmad.rizki@telkomuniversity.ac.id', disabled: false },
            { label: 'Nomor Telepon', val: '081234567890', disabled: false },
            { label: 'Angkatan / Tahun', val: '2023', disabled: true },
            { label: 'Program Studi / Unit', val: 'S1 Teknik Industri', disabled: true },
          ].map(({ label, val, disabled }) => (
            <div key={label} className="space-y-2">
              <label className="text-[14px] font-semibold text-[#1a1a1a]">{label}</label>
              <input
                type="text"
                defaultValue={val}
                disabled={disabled}
                className={`w-full text-[15px] rounded-xl px-4 py-3 border border-gray-200 transition-all focus:outline-none ${disabled ? 'bg-[#f0f2f5] text-gray-500 cursor-not-allowed' : 'bg-[#f8f9fa] text-gray-800 focus:ring-2 focus:ring-[#50c878]/50'}`}
              />
            </div>
          ))}
        </div>

        <Button className="mt-8 bg-[#006400] hover:bg-[#004d00] text-white rounded-xl h-12 px-8 text-[15px] font-semibold">
          Simpan Perubahan
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6 md:p-8">
        <div className="flex gap-4 items-start mb-6">
          <Shield className="h-6 w-6 text-[#50c878] mt-1 flex-shrink-0" />
          <div>
            <h2 className="text-[18px] font-semibold text-[#1a1a1a]">Autentikasi Dua Faktor (2FA)</h2>
            <p className="text-[14px] text-gray-500 mt-1">Tingkatkan keamanan akun dengan autentikasi dua faktor</p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 flex items-center justify-between">
          <div>
            <h4 className="text-[14px] font-semibold text-gray-900 mb-1">Status 2FA</h4>
            <p className="text-[13px] text-gray-500">Aktifkan untuk keamanan tambahan</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${is2FaEnabled ? 'bg-[#eafaf1] text-[#50c878]' : 'bg-gray-200 text-gray-500'}`}>
              {is2FaEnabled ? 'Aktif' : 'Nonaktif'}
            </span>
            <Switch checked={is2FaEnabled} onCheckedChange={handle2FaToggle} className="data-[state=checked]:bg-[#50c878]" />
          </div>
        </div>
      </div>

      <Dialog open={mfaModalOpen} onOpenChange={(open) => { if (!open) setMfaModalOpen(false); }}>
        <DialogPortal>
          <DialogOverlay className="bg-black/40 backdrop-blur-sm" />
          <DialogContent className="sm:max-w-[420px] p-6 bg-white rounded-2xl gap-0 shadow-2xl">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-[18px] font-semibold text-gray-900">Setup Autentikasi Dua Faktor</DialogTitle>
              <DialogDescription className="text-[14px] text-gray-500">Langkah 1: Scan QR Code</DialogDescription>
            </DialogHeader>
            <div className="mt-2 space-y-6">
              <p className="text-[14px] text-gray-600 leading-relaxed">Gunakan aplikasi authenticator (Google Authenticator, Authy, dll) untuk scan QR code di bawah ini:</p>
              <div className="border-2 border-dashed border-gray-200 bg-gray-50 rounded-xl p-8 flex flex-col items-center gap-4">
                <div className="h-32 w-32 bg-gray-200 rounded-xl flex items-center justify-center">
                  <Smartphone className="h-10 w-10 text-gray-400" />
                </div>
                <span className="text-[13px] text-gray-400 font-medium">QR Code akan ditampilkan di sini</span>
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-semibold text-gray-700">Atau masukkan kode manual:</label>
                <div className="flex items-center relative">
                  <input type="text" readOnly value="JBSWY3DPEHPK3PXP" className="w-full bg-white text-gray-800 text-[14px] font-mono rounded-lg px-4 py-3 border border-gray-200 pr-12 focus:outline-none focus:border-[#50c878]" />
                  <button className="absolute right-3 text-gray-400 hover:text-gray-600"><Copy className="h-4 w-4" /></button>
                </div>
              </div>
              <Button onClick={() => { setMfaModalOpen(false); setIs2FaEnabled(true); }} className="w-full bg-[#006400] hover:bg-[#004d00] text-white rounded-xl h-12 text-[15px] font-semibold mt-4">
                Lanjut ke Verifikasi
              </Button>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
