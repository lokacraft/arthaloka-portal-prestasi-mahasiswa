"use client";

import React, { useState } from 'react';
import { Download, TrendingUp, CheckCircle2, ExternalLink, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogOverlay, DialogPortal } from '@/components/ui/dialog';

function TrendChart() {
  const data = [
    { year: '2022', int: 5, nas: 12, wil: 8 },
    { year: '2023', int: 8, nas: 18, wil: 12 },
    { year: '2024', int: 12, nas: 24, wil: 16 },
    { year: '2025', int: 18, nas: 35, wil: 20 },
    { year: '2026', int: 22, nas: 45, wil: 25 },
  ];
  const padL = 36, padR = 16, padT = 16, padB = 36;
  const maxVal = 60;
  const W = 800, H = 200;
  const xStep = (W - padL - padR) / (data.length - 1);
  const toX = (i: number) => padL + i * xStep;
  const toY = (v: number) => padT + (H - padT - padB) * (1 - v / maxVal);

  const line = (vals: number[], color: string) => {
    const pts = vals.map((v, i) => `${toX(i)},${toY(v)}`).join(' ');
    return (
      <g key={color}>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
        {vals.map((v, i) => <circle key={i} cx={toX(i)} cy={toY(v)} r="4" fill="white" stroke={color} strokeWidth="2" />)}
      </g>
    );
  };

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="none" style={{ minHeight: 180 }}>
        {[0, 15, 30, 45, 60].map(t => (
          <g key={t}>
            <line x1={padL} x2={W - padR} y1={toY(t)} y2={toY(t)} stroke="#f1f5f9" strokeWidth="1" />
            <text x={padL - 6} y={toY(t) + 4} textAnchor="end" fontSize="9" fill="#94a3b8">{t}</text>
          </g>
        ))}
        {data.map((d, i) => (
          <text key={i} x={toX(i)} y={H - 4} textAnchor="middle" fontSize="9" fill="#94a3b8">{d.year}</text>
        ))}
        {line(data.map(d => d.int), '#50c878')}
        {line(data.map(d => d.nas), '#22c55e')}
        {line(data.map(d => d.wil), '#86efac')}
      </svg>
    </div>
  );
}

const indicators = [
  { key: 'NI', label: 'NI (Nasional Akademik)', value: 38, target: 35 },
  { key: 'NN', label: 'NN (Nasional Non-Akademik)', value: 45, target: 40 },
  { key: 'NW', label: 'NW (Wilayah Akademik)', value: 25, target: 30 },
  { key: 'RI', label: 'RI (Internasional Akademik)', value: 22, target: 20 },
  { key: 'RN', label: 'RN (Internasional Non-Akademik)', value: 12, target: 15 },
  { key: 'RW', label: 'RW (Wilayah Non-Akademik)', value: 30, target: 25 },
];

const tableData = [
  { tahun: 2026, kategori: 'Akademik', level: 'Internasional', jumlah: 22, mahasiswa: 18 },
  { tahun: 2026, kategori: 'Non-Akademik', level: 'Nasional', jumlah: 45, mahasiswa: 38 },
  { tahun: 2025, kategori: 'Akademik', level: 'Nasional', jumlah: 38, mahasiswa: 32 },
  { tahun: 2025, kategori: 'Non-Akademik', level: 'Wilayah', jumlah: 30, mahasiswa: 25 },
];

const levelColor: Record<string, string> = {
  Internasional: 'bg-blue-50 text-blue-600 border border-blue-100',
  Nasional: 'bg-[#eafaf1] text-[#50c878] border border-[#50c878]/20',
  Wilayah: 'bg-amber-50 text-amber-600 border border-amber-100',
};

// Base UI onValueChange handler wrapper
function onSelectChange(setter: React.Dispatch<React.SetStateAction<string>>) {
  return (value: string | null) => { if (value !== null) setter(value); };
}

export default function DashboardAkreditasiPage() {
  const [exportOpen, setExportOpen] = useState(false);
  const [exportMode, setExportMode] = useState<'all' | 'filtered'>('all');
  const [kategori, setKategori] = useState('semua');
  const [level, setLevel] = useState('semua');
  const [tahun, setTahun] = useState('semua');

  const filtered = tableData.filter(d =>
    (kategori === 'semua' || d.kategori.toLowerCase().replace('-', '') === kategori) &&
    (level === 'semua' || d.level.toLowerCase() === level) &&
    (tahun === 'semua' || String(d.tahun) === tahun)
  );

  return (
    <div className="flex flex-col gap-6 pb-8 font-sans animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#1a1a1a] tracking-tight">Dashboard Akreditasi</h1>
          <p className="text-gray-500 text-[15px] mt-1">Analitik prestasi mahasiswa untuk LAM TEKNIK</p>
        </div>
        <Button onClick={() => setExportOpen(true)} className="bg-[#006400] hover:bg-[#004d00] text-white rounded-xl h-11 px-5 font-semibold flex items-center gap-2 shadow-md w-full md:w-auto justify-center">
          <Download className="h-4 w-4" />Export Excel
        </Button>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-5">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-gray-500" />
          <h2 className="text-[14px] font-semibold text-gray-700">Filter Data</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1 flex flex-col">
            <label className="text-[12px] font-medium text-gray-400">Kategori</label>
            <Select value={kategori} onValueChange={onSelectChange(setKategori)}>
              <SelectTrigger className="bg-[#f8f9fa] rounded-lg h-11 border-gray-200 text-[14px] w-full">
                <SelectValue placeholder="Semua Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua Kategori</SelectItem>
                <SelectItem value="akademik">Akademik</SelectItem>
                <SelectItem value="nonakademik">Non-Akademik</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1 flex flex-col">
            <label className="text-[12px] font-medium text-gray-400">Level</label>
            <Select value={level} onValueChange={onSelectChange(setLevel)}>
              <SelectTrigger className="bg-[#f8f9fa] rounded-lg h-11 border-gray-200 text-[14px] w-full">
                <SelectValue placeholder="Semua Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua Level</SelectItem>
                <SelectItem value="internasional">Internasional</SelectItem>
                <SelectItem value="nasional">Nasional</SelectItem>
                <SelectItem value="wilayah">Wilayah</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1 flex flex-col">
            <label className="text-[12px] font-medium text-gray-400">Tahun</label>
            <Select value={tahun} onValueChange={onSelectChange(setTahun)}>
              <SelectTrigger className="bg-[#f8f9fa] rounded-lg h-11 border-gray-200 text-[14px] w-full">
                <SelectValue placeholder="Semua Tahun" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua Tahun</SelectItem>
                {['2026','2025','2024','2023','2022'].map(y => (
                  <SelectItem key={y} value={y}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6 md:p-8">
        <h2 className="text-[16px] font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-[#50c878]" />Tren Prestasi 5 Tahun
        </h2>
        <TrendChart />
        <div className="flex flex-wrap gap-5 mt-3 justify-center">
          {([['#50c878','Internasional'],['#22c55e','Nasional'],['#86efac','Wilayah']] as [string, string][]).map(([c, l]) => (
            <div key={l} className="flex items-center gap-1.5">
              <span className="w-8 h-0.5 rounded-full" style={{ backgroundColor: c }}></span>
              <span className="text-[12px] text-gray-500">{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Indikator */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6 md:p-8">
        <h2 className="text-[16px] font-semibold text-gray-900 mb-6">Indikator Akreditasi (LAM TEKNIK)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {indicators.map(ind => {
            const pct = Math.min(100, Math.round((ind.value / ind.target) * 100));
            const met = ind.value >= ind.target;
            return (
              <div key={ind.key} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <p className="text-[12px] text-gray-500 font-medium mb-2">{ind.label}</p>
                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="text-[28px] font-bold text-gray-900">{ind.value}</span>
                  <span className="text-[12px] text-gray-400">/ {ind.target} target</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: met ? '#50c878' : '#f59e0b' }} />
                </div>
                {met && <div className="flex justify-end mt-2"><CheckCircle2 className="h-4 w-4 text-[#50c878]" /></div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Rekap Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-100">
          <h2 className="text-[16px] font-semibold text-gray-900">Rekap Data 5 Tahun Terakhir</h2>
        </div>
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                {['Tahun','Kategori','Level','Jumlah Prestasi','Jumlah Mahasiswa','Link Evidence'].map(h => (
                  <th key={h} className="text-left py-4 px-6 text-[13px] font-semibold text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-[14px] font-medium text-gray-900">{row.tahun}</td>
                  <td className="py-4 px-6 text-[14px] text-gray-700">{row.kategori}</td>
                  <td className="py-4 px-6"><span className={`text-[12px] font-semibold px-3 py-1 rounded-full ${levelColor[row.level]}`}>{row.level}</span></td>
                  <td className="py-4 px-6 text-[14px] text-gray-700">{row.jumlah}</td>
                  <td className="py-4 px-6 text-[14px] text-gray-700">{row.mahasiswa}</td>
                  <td className="py-4 px-6"><button className="text-[#50c878] hover:text-[#006400] text-[14px] font-medium flex items-center gap-1 transition-colors"><ExternalLink className="h-4 w-4" />Lihat</button></td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} className="py-12 text-center text-gray-400 text-[14px]">Tidak ada data sesuai filter</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="md:hidden flex flex-col divide-y divide-gray-100">
          {filtered.map((row, i) => (
            <div key={i} className="p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[15px] font-semibold text-gray-900">{row.tahun} – {row.kategori}</span>
                <span className={`text-[12px] font-semibold px-2 py-0.5 rounded-full ${levelColor[row.level]}`}>{row.level}</span>
              </div>
              <div className="flex gap-4 text-[13px] text-gray-500">
                <span>Prestasi: <b className="text-gray-900">{row.jumlah}</b></span>
                <span>Mhs: <b className="text-gray-900">{row.mahasiswa}</b></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Dialog */}
      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogPortal>
          <DialogOverlay className="bg-black/40 backdrop-blur-sm" />
          <DialogContent className="sm:max-w-[440px] p-6 bg-white rounded-2xl gap-0 shadow-2xl">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-[18px] font-semibold text-gray-900">Export Data Excel</DialogTitle>
              <DialogDescription className="text-[14px] text-gray-500">Pilih rentang tahun yang akan diekspor</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              {[
                { mode: 'all' as const, title: 'Semua Data', desc: 'Export seluruh data 5 tahun' },
                { mode: 'filtered' as const, title: 'Sesuai Filter', desc: 'Export hanya data yang ditampilkan' },
              ].map(opt => (
                <button key={opt.mode} onClick={() => setExportMode(opt.mode)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${exportMode === opt.mode ? 'border-[#50c878] bg-[#eafaf1]' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                  <p className="text-[15px] font-semibold text-gray-900">{opt.title}</p>
                  <p className="text-[13px] text-gray-500 mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setExportOpen(false)} className="flex-1 rounded-xl h-11 text-[14px] border-gray-200">Batal</Button>
              <Button className="flex-1 bg-[#006400] hover:bg-[#004d00] text-white rounded-xl h-11 text-[14px] font-semibold flex items-center justify-center gap-2">
                <Download className="h-4 w-4" />Download .xlsx
              </Button>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
