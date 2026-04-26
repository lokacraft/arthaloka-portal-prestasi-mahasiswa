"use client";

import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const riwayat = [
  { tahun: '2025', jumlah: 445, updateAt: '2025-04-01' },
  { tahun: '2024', jumlah: 430, updateAt: '2024-04-15' },
  { tahun: '2023', jumlah: 420, updateAt: '2023-03-20' },
];

export default function KelolaNmtsPage() {
  const [tahun, setTahun] = useState('');
  const [jumlah, setJumlah] = useState('');

  return (
    <div className="flex flex-col gap-6 pb-8 font-sans animate-in fade-in duration-500">
      <div>
        <h1 className="text-[28px] font-bold text-[#1a1a1a] tracking-tight">Kelola NM(TS)</h1>
        <p className="text-gray-500 text-[15px] mt-1">Kelola jumlah mahasiswa aktif untuk perhitungan rasio akreditasi</p>
      </div>

      <div className="bg-[#eafaf1] border border-[#50c878]/30 rounded-2xl p-6 flex items-start gap-4">
        <div className="h-8 w-8 rounded-full bg-[#50c878]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Users className="h-4 w-4 text-[#50c878]" />
        </div>
        <div>
          <h4 className="text-[15px] font-bold text-[#006400]">Apa itu NM(TS)?</h4>
          <p className="text-[14px] text-[#004d00]/80 mt-1.5 leading-relaxed">NM(TS) adalah Jumlah Mahasiswa aktif pada Tahun Semester yang berjalan. Nilai ini digunakan sebagai pembagi dalam perhitungan Rasio RI, RN, dan RW untuk akreditasi LAM TEKNIK.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6 md:p-8">
        <h2 className="text-[18px] font-semibold text-[#1a1a1a] mb-6">Input Nilai NM(TS)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-[14px] font-semibold text-[#1a1a1a]">Tahun</label>
            <input type="text" value={tahun} onChange={e => setTahun(e.target.value)} placeholder="Contoh: 2026" className="w-full bg-[#f8f9fa] text-gray-800 placeholder-gray-400 text-[15px] rounded-xl px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#50c878]/50" />
          </div>
          <div className="space-y-2">
            <label className="text-[14px] font-semibold text-[#1a1a1a]">Jumlah Mahasiswa Aktif</label>
            <input type="number" value={jumlah} onChange={e => setJumlah(e.target.value)} placeholder="450" className="w-full bg-[#f8f9fa] text-gray-800 placeholder-gray-400 text-[15px] rounded-xl px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#50c878]/50" />
          </div>
        </div>
        <Button disabled={!tahun || !jumlah} className="w-full bg-[#006400] hover:bg-[#004d00] text-white disabled:bg-gray-200 disabled:text-gray-400 rounded-xl h-12 text-[15px] font-semibold">
          Simpan Nilai NM(TS)
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-100"><h2 className="text-[18px] font-semibold text-[#1a1a1a]">Riwayat NM(TS)</h2></div>
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                {['Tahun','Jumlah Mahasiswa','Terakhir Diperbarui'].map(h => <th key={h} className="text-left py-4 px-6 text-[14px] font-semibold text-gray-500">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {riwayat.map(r => (
                <tr key={r.tahun} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-[15px] font-medium text-gray-900">{r.tahun}</td>
                  <td className="py-4 px-6 text-[15px] text-gray-700">{r.jumlah}</td>
                  <td className="py-4 px-6 text-[14px] text-gray-400">{r.updateAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="md:hidden flex flex-col divide-y divide-gray-100">
          {riwayat.map(r => (
            <div key={r.tahun} className="p-5 flex flex-col gap-2">
              <div className="flex justify-between"><span className="text-[16px] font-semibold text-gray-900">{r.tahun}</span><span className="text-[15px] text-gray-700 font-medium">{r.jumlah} mhs</span></div>
              <span className="text-[13px] text-gray-400">Diperbarui: {r.updateAt}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
