"use client";

import React, { useState } from 'react';
import { Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogOverlay, DialogPortal } from '@/components/ui/dialog';

const allData = [
  { tahun: 2026, kuartal: 'Q2', nama: 'International Mathematics Olympiad', penyelenggara: 'IMO Foundation', mhs: 'Ahmad Rizki', nim: '1234567890', angkatan: 2023, kategori: 'Akademik', level: 'Internasional' },
  { tahun: 2026, kuartal: 'Q2', nama: 'Hackathon Indonesia 2026', penyelenggara: 'Kementerian Komunikasi', mhs: 'Budi Santoso', nim: '1234567891', angkatan: 2023, kategori: 'Non-Akademik', level: 'Nasional' },
  { tahun: 2026, kuartal: 'Q1', nama: 'Lomba Karya Tulis Ilmiah Nasional', penyelenggara: 'Dikti', mhs: 'Citra Dewi', nim: '1234567892', angkatan: 2024, kategori: 'Akademik', level: 'Nasional' },
  { tahun: 2025, kuartal: 'Q4', nama: 'Asia Startup Competition', penyelenggara: 'Asian Tech Alliance', mhs: 'Deni Pratama', nim: '1234567893', angkatan: 2022, kategori: 'Non-Akademik', level: 'Internasional' },
  { tahun: 2025, kuartal: 'Q3', nama: 'Lomba Debat Bahasa Inggris Regional', penyelenggara: 'Kopertis Wilayah IV', mhs: 'Eka Fitriani', nim: '1234567894', angkatan: 2023, kategori: 'Akademik', level: 'Wilayah' },
  { tahun: 2024, kuartal: 'Q2', nama: 'National Science Fair', penyelenggara: 'Kemendikbud', mhs: 'Fajar Nugroho', nim: '1234567895', angkatan: 2022, kategori: 'Akademik', level: 'Nasional' },
];

const kategoriColor: Record<string, string> = {
  'Akademik': 'bg-gray-100 text-gray-600',
  'Non-Akademik': 'bg-gray-100 text-gray-600',
};

const levelColor: Record<string, string> = {
  Internasional: 'bg-blue-50 text-blue-600 border border-blue-100',
  Nasional: 'bg-[#eafaf1] text-[#50c878] border border-[#50c878]/20',
  Wilayah: 'bg-amber-50 text-amber-600 border border-amber-100',
};

function onSelectChange(setter: React.Dispatch<React.SetStateAction<string>>) {
  return (value: string | null) => { if (value !== null) setter(value); };
}

export default function RekapPage() {
  const [exportOpen, setExportOpen] = useState(false);
  const [exportMode, setExportMode] = useState<'all' | 'filtered'>('all');
  const [tahun, setTahun] = useState('semua');
  const [kategori, setKategori] = useState('semua');
  const [level, setLevel] = useState('semua');
  const [angkatan, setAngkatan] = useState('semua');

  const filtered = allData.filter(d =>
    (tahun === 'semua' || String(d.tahun) === tahun) &&
    (kategori === 'semua' || d.kategori.toLowerCase().replace('-', '') === kategori) &&
    (level === 'semua' || d.level.toLowerCase() === level) &&
    (angkatan === 'semua' || String(d.angkatan) === angkatan)
  );

  const totalAkademik = filtered.filter(d => d.kategori === 'Akademik').length;
  const totalNonAkademik = filtered.filter(d => d.kategori === 'Non-Akademik').length;
  const totalInternasional = filtered.filter(d => d.level === 'Internasional').length;

  return (
    <div className="flex flex-col gap-6 pb-8 font-sans animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#1a1a1a] tracking-tight">Rekap Prestasi 5 Tahun</h1>
          <p className="text-gray-500 text-[15px] mt-1">Data lengkap prestasi mahasiswa yang telah divalidasi (2022–2026)</p>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Tahun', value: tahun, setter: setTahun, options: [['semua','Semua Tahun'], ...['2026','2025','2024','2023','2022'].map(y => [y, y])] },
            { label: 'Kategori', value: kategori, setter: setKategori, options: [['semua','Semua Kategori'],['akademik','Akademik'],['nonakademik','Non-Akademik']] },
            { label: 'Level', value: level, setter: setLevel, options: [['semua','Semua Level'],['internasional','Internasional'],['nasional','Nasional'],['wilayah','Wilayah']] },
            { label: 'Angkatan', value: angkatan, setter: setAngkatan, options: [['semua','Semua Angkatan'], ...['2024','2023','2022','2021','2020'].map(a => [a, a])] },
          ].map(({ label, value, setter, options }) => (
            <div key={label} className="flex flex-col space-y-1">
              <label className="text-[12px] font-medium text-gray-400">{label}</label>
              <Select value={value} onValueChange={onSelectChange(setter)}>
                <SelectTrigger className="bg-[#f8f9fa] rounded-lg h-11 border-gray-200 text-[14px] w-full">
                  <SelectValue placeholder={`Semua ${label}`} />
                </SelectTrigger>
                <SelectContent>
                  {options.map(([val, lbl]) => (
                    <SelectItem key={val} value={val}>{lbl}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-gray-900">Data Prestasi Valid</h2>
          <span className="text-[13px] text-gray-400">Menampilkan {filtered.length} dari {allData.length} data</span>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                {['No','Tahun','Kuartal','Nama Kegiatan','Penyelenggara','Mahasiswa (NIM)','Angkatan','Kategori'].map(h => (
                  <th key={h} className="text-left py-4 px-4 text-[13px] font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-4 text-[13px] text-gray-400">{i + 1}</td>
                  <td className="py-4 px-4 text-[14px] font-medium text-gray-900">{row.tahun}</td>
                  <td className="py-4 px-4 text-[14px] text-gray-700">{row.kuartal}</td>
                  <td className="py-4 px-4 text-[14px] text-gray-900 max-w-[200px]">{row.nama}</td>
                  <td className="py-4 px-4 text-[13px] text-gray-600">{row.penyelenggara}</td>
                  <td className="py-4 px-4 text-[14px]">
                    <p className="font-medium text-gray-800">{row.mhs}</p>
                    <p className="text-gray-400 text-[12px]">({row.nim})</p>
                  </td>
                  <td className="py-4 px-4 text-[14px] text-gray-700">{row.angkatan}</td>
                  <td className="py-4 px-4">
                    <span className={`text-[12px] font-medium px-2.5 py-1 rounded-lg ${kategoriColor[row.kategori]}`}>{row.kategori}</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="py-12 text-center text-gray-400 text-[14px]">Tidak ada data sesuai filter</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden flex flex-col divide-y divide-gray-100">
          {filtered.map((row, i) => (
            <div key={i} className="p-5 space-y-2">
              <div className="flex flex-wrap items-start gap-2 justify-between">
                <span className="text-[14px] font-semibold text-gray-900 flex-1">{row.nama}</span>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${kategoriColor[row.kategori]}`}>{row.kategori}</span>
              </div>
              <p className="text-[13px] text-gray-500">{row.mhs} · Angkatan {row.angkatan}</p>
              <div className="flex gap-3 text-[12px] text-gray-400">
                <span>{row.tahun} {row.kuartal}</span><span>·</span><span>{row.penyelenggara}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Prestasi', value: filtered.length },
          { label: 'Akademik', value: totalAkademik },
          { label: 'Non-Akademik', value: totalNonAkademik },
          { label: 'Internasional', value: totalInternasional },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-[13px] text-gray-500 font-medium">{s.label}</p>
            <p className="text-[28px] font-bold text-gray-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Export Dialog */}
      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogPortal>
          <DialogOverlay className="bg-black/40 backdrop-blur-sm" />
          <DialogContent className="sm:max-w-[440px] p-6 bg-white rounded-2xl gap-0 shadow-2xl">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-[18px] font-semibold text-gray-900">Export Data Excel</DialogTitle>
              <DialogDescription className="text-[14px] text-gray-500">Pilih data yang akan diekspor</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              {[
                { mode: 'all' as const, title: `Semua Data (${allData.length} prestasi)`, desc: 'Export seluruh data 5 tahun' },
                { mode: 'filtered' as const, title: `Data Terfilter (${filtered.length} prestasi)`, desc: 'Export hanya data yang ditampilkan' },
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
