"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Trash2, CheckCircle2, XCircle, AlertCircle, Bell, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NotifikasiContent() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6 pb-8 font-sans animate-in fade-in duration-500">
      <div>
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-[#50c878] hover:text-[#006400] font-medium text-[15px] transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" />Kembali
        </button>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold text-[#1a1a1a] tracking-tight">Notifikasi</h1>
            <p className="text-gray-500 text-[15px] mt-1">2 notifikasi belum dibaca</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" className="h-10 px-4 rounded-xl text-[14px] font-medium text-gray-700 border-gray-200">
              <Check className="h-4 w-4 mr-2" />Tandai Semua Dibaca
            </Button>
            <Button variant="outline" className="h-10 px-4 rounded-xl text-[14px] font-medium text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100">
              <Trash2 className="h-4 w-4 mr-2" />Hapus yang Dibaca
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex gap-3">
          <button className="px-5 py-2 rounded-lg bg-[#50c878] text-white text-[14px] font-semibold">Semua (5)</button>
          <button className="px-5 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 text-[14px] font-semibold">Belum Dibaca (2)</button>
        </div>

        <div className="flex flex-col divide-y divide-gray-100">
          {[
            { icon: <CheckCircle2 className="h-6 w-6 text-[#50c878]" />, bg: 'bg-[#eafaf1]', bar: 'bg-[#50c878]', unread: true, title: 'Prestasi Disetujui', desc: "Prestasi 'Lomba Hackathon Nasional' telah divalidasi oleh Admin Kemahasiswaan", time: '2 jam yang lalu', tag: 'Prestasi' },
            { icon: <XCircle className="h-6 w-6 text-red-500" />, bg: 'bg-red-50', bar: 'bg-red-500', unread: true, title: 'Prestasi Ditolak', desc: "Prestasi 'Kompetisi Desain Grafis' ditolak. Lihat catatan penolakan untuk detail.", time: '5 jam yang lalu', tag: 'Prestasi' },
            { icon: <AlertCircle className="h-6 w-6 text-amber-500" />, bg: 'bg-amber-50', bar: null, unread: false, title: 'Pengingat Deadline', desc: 'Deadline pengajuan prestasi kuartal Q2 akan berakhir dalam 3 hari', time: '1 hari yang lalu', tag: 'Pengingat' },
            { icon: <Bell className="h-6 w-6 text-blue-500" />, bg: 'bg-blue-50', bar: null, unread: false, title: 'Update Sistem', desc: 'Sistem akan menjalani maintenance pada tanggal 30 April 2026 pukul 00:00-02:00 WIB', time: '2 hari yang lalu', tag: 'Sistem' },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 p-6 hover:bg-gray-50/50 transition-colors relative group">
              {item.bar && <div className={`absolute top-8 left-0 w-1 h-12 ${item.bar} rounded-r-full hidden md:block`}></div>}
              <div className={`h-12 w-12 rounded-full ${item.bg} flex items-center justify-center flex-shrink-0`}>{item.icon}</div>
              <div className="flex flex-col flex-1">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="text-[15px] font-semibold text-gray-900 flex items-center gap-2">
                      {item.title}
                      {item.unread && <span className="w-2 h-2 rounded-full bg-[#50c878] shrink-0"></span>}
                    </h4>
                    <p className="text-[14px] text-gray-600 mt-1">{item.desc}</p>
                    <span className="text-[13px] text-gray-400 mt-2 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5"/> {item.time}
                      <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[11px] font-medium ml-2">{item.tag}</span>
                    </span>
                  </div>
                  <button className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-2">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
