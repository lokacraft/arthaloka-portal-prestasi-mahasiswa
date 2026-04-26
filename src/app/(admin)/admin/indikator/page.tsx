"use client";

import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

type IKey = 'NI'|'NN'|'NW'|'RI'|'RN'|'RW';
type IVal = { ts: number; ts1: number; ts2: number };
type IData = Record<IKey, IVal>;

const INDICATORS: { key: IKey; label: string }[] = [
  { key: 'NI', label: 'NI – Prestasi Nasional Akademik' },
  { key: 'NN', label: 'NN – Prestasi Nasional Non-Akademik' },
  { key: 'NW', label: 'NW – Prestasi Wilayah Akademik' },
  { key: 'RI', label: 'RI – Prestasi Internasional Akademik' },
  { key: 'RN', label: 'RN – Prestasi Internasional Non-Akademik' },
  { key: 'RW', label: 'RW – Prestasi Wilayah Non-Akademik' },
];

const empty: IVal = { ts: 0, ts1: 0, ts2: 0 };

export default function IndikatorPage() {
  const [tahun, setTahun] = useState('2025/2026');
  const [nmts, setNmts] = useState(450);
  const [data, setData] = useState<IData>({ NI: {...empty}, NN: {...empty}, NW: {...empty}, RI: {...empty}, RN: {...empty}, RW: {...empty} });

  const update = (key: IKey, field: keyof IVal, val: string) => {
    setData(prev => ({ ...prev, [key]: { ...prev[key], [field]: Math.max(0, parseInt(val) || 0) } }));
  };

  const rasio = (v: IVal) => nmts === 0 ? '0.000' : ((v.ts + v.ts1 + v.ts2) / nmts).toFixed(3);

  return (
    <div className="flex flex-col gap-6 pb-8 font-sans animate-in fade-in duration-500">
      <div className="bg-[#50c878] rounded-2xl p-6 flex items-start gap-4">
        <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5"><Info className="h-4 w-4 text-white" /></div>
        <div>
          <h4 className="text-[15px] font-bold text-white">Petunjuk Pengisian</h4>
          <p className="text-[14px] text-white/90 mt-1.5 leading-relaxed">Form ini digunakan untuk menghitung rasio prestasi mahasiswa sesuai standar LAM TEKNIK. Isi jumlah mahasiswa yang meraih prestasi pada setiap kategori untuk 3 tahun terakhir (TS, TS-1, TS-2).</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6 md:p-8">
        <h2 className="text-[18px] font-semibold text-[#1a1a1a] mb-6">Data Umum</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[14px] font-semibold text-[#1a1a1a]">Tahun Akademik</label>
            <input type="text" value={tahun} onChange={e => setTahun(e.target.value)} className="w-full bg-[#f8f9fa] text-gray-800 text-[15px] rounded-xl px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#50c878]/50" />
          </div>
          <div className="space-y-2">
            <label className="text-[14px] font-semibold text-[#1a1a1a]">Jumlah Mahasiswa Aktif (NM(TS))</label>
            <input type="number" value={nmts} onChange={e => setNmts(parseInt(e.target.value) || 0)} className="w-full bg-[#f8f9fa] text-gray-800 text-[15px] rounded-xl px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#50c878]/50" />
          </div>
        </div>
      </div>

      {INDICATORS.map(({ key, label }) => (
        <div key={key} className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[17px] font-semibold text-[#1a1a1a]">{label}</h2>
            <div className="bg-[#eafaf1] border border-[#50c878]/20 text-[#006400] text-[13px] font-bold px-4 py-1.5 rounded-full">Rasio: {rasio(data[key])}</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(['ts','ts1','ts2'] as (keyof IVal)[]).map((field, i) => (
              <div key={field} className="space-y-2">
                <label className="text-[13px] font-medium text-gray-500">{i === 0 ? 'Tahun Sekarang (TS)' : `TS-${i}`}</label>
                <input type="number" min={0} value={data[key][field] || ''} placeholder="0" onChange={e => update(key, field, e.target.value)} className="w-full bg-[#f8f9fa] text-gray-800 placeholder-gray-400 text-[15px] rounded-xl px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#50c878]/50" />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6">
        <Button className="w-full bg-[#006400] hover:bg-[#004d00] text-white rounded-xl h-12 text-[15px] font-semibold">Simpan Data Indikator</Button>
      </div>
    </div>
  );
}
