"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, Award, Users, Target, Loader2, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogOverlay, DialogPortal } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getRekapLengkap, getTrendPrestasi, getNmTs, getTargets, getProgramStudiByNama } from '@/server/akreditasi-actions';
import { toast } from 'sonner';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, CartesianGrid, XAxis, YAxis, Line, BarChart as RechartsBarChart, Bar } from 'recharts';

function onSelectChange(setter: React.Dispatch<React.SetStateAction<any>>) {
  return (value: string | null) => { if (value !== null) setter(value); };
}

// Warna kontras untuk 3 level
const CHART_COLORS = {
  int: '#6366f1', // indigo — Internasional
  nas: '#f59e0b', // amber  — Nasional
  wil: '#50c878', // hijau  — Wilayah (brand)
};

const TABLE_PAGE_SIZE = 10;

export default function KaprodiDashboardPage() {
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - 5 + i).reverse();

  const [filterOpen, setFilterOpen] = useState(false);
  const [tahunSasaran, setTahunSasaran] = useState(currentYear.toString());
  const [rentangMode, setRentangMode] = useState('5');

  // Data states
  const [loading, setLoading] = useState(true);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [nmtsVal, setNmtsVal] = useState<number | null>(null);
  const [targets, setTargets] = useState({ RI: 0.05, RN: 0.5, RW: 1.5 });
  const [totalPrestasi, setTotalPrestasi] = useState(0);
  const [uniqueMahasiswa, setUniqueMahasiswa] = useState(0);
  const [barData, setBarData] = useState<any[]>([]);
  const [rekapAuto, setRekapAuto] = useState({ NI: 0, NN: 0, NW: 0 });

  // Tabel prestasi valid
  const [prestasiList, setPrestasiList] = useState<any[]>([]);
  const [tablePage, setTablePage] = useState(1);

  useEffect(() => {
    fetchData();
  }, [tahunSasaran, rentangMode]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setTablePage(1);
      const ts = parseInt(tahunSasaran);
      const rm = parseInt(rentangMode);

      const prodi = await getProgramStudiByNama("Teknik Industri");
      const programStudiId = prodi ? prodi.id : "Semua";

      const [trend, nmts, targetData, details] = await Promise.all([
        getTrendPrestasi(ts, rm, programStudiId),
        getNmTs(ts),
        getTargets(),
        getRekapLengkap({ startYear: ts - rm + 1, endYear: ts, programStudiId }),
      ]);

      setTrendData(trend);
      setPrestasiList(details);

      if (nmts && !Array.isArray(nmts)) setNmtsVal(nmts.jumlahMahasiswa);
      if (targetData) {
        setTargets({
          RI: targetData.find((t: any) => t.kodeTarget === 'RI')?.nilaiPersen || 0.05,
          RN: targetData.find((t: any) => t.kodeTarget === 'RN')?.nilaiPersen || 0.5,
          RW: targetData.find((t: any) => t.kodeTarget === 'RW')?.nilaiPersen || 1.5,
        });
      }

      setTotalPrestasi(details.length);
      const uniqueNims = new Set(details.map((d: any) => d.mahasiswa?.nim).filter(Boolean));
      setUniqueMahasiswa(uniqueNims.size);

      let akadCount = 0; let nonAkadCount = 0;
      let NI = 0; let NN = 0; let NW = 0;

      details.forEach((d: any) => {
        const nama = d.kategori?.nama?.toLowerCase() || '';
        const tk = d.tingkat?.nama?.toLowerCase() || '';

        if (nama.includes('akademik') && !nama.includes('non')) { akadCount++; } else { nonAkadCount++; }

        if (tk.includes('internasional')) { NI++; }
        else if (tk.includes('nasional')) { NN++; }
        else if (tk.includes('wilayah') || tk.includes('lokal')) { NW++; }
      });

      setBarData([
        { label: 'Akademik', value: akadCount },
        { label: 'Non-Akademik', value: nonAkadCount },
      ]);
      setRekapAuto({ NI, NN, NW });

    } catch {
      toast.error("Gagal memuat data dashboard");
    } finally {
      setLoading(false);
    }
  };

  const rasioAuto = (val: number) => nmtsVal ? (val / nmtsVal) * 100 : 0;

  const riRasio = rasioAuto(rekapAuto.NI);
  const rnRasio = rasioAuto(rekapAuto.NN);
  const rwRasio = rasioAuto(rekapAuto.NW);

  let targetMetCount = 0;
  if (riRasio >= targets.RI) targetMetCount++;
  if (rnRasio >= targets.RN) targetMetCount++;
  if (rwRasio >= targets.RW) targetMetCount++;
  const pctTarget = Math.round((targetMetCount / 3) * 100);

  const scorecardData = [
    { key: 'NI', label: 'Capaian Internasional (NI)', value: rekapAuto.NI.toString(), color: 'bg-[#eafaf1] text-[#22c55e]' },
    { key: 'NN', label: 'Capaian Nasional (NN)', value: rekapAuto.NN.toString(), color: 'bg-[#eafaf1] text-[#22c55e]' },
    { key: 'NW', label: 'Capaian Wilayah/Lokal (NW)', value: rekapAuto.NW.toString(), color: 'bg-[#eafaf1] text-[#22c55e]' },
    { key: 'RI', label: `Rasio Internasional (Target: ${targets.RI}%)`, value: `${riRasio.toFixed(2)}%`, color: riRasio >= targets.RI ? 'bg-[#eafaf1] text-[#22c55e]' : 'bg-amber-50 text-amber-500' },
    { key: 'RN', label: `Rasio Nasional (Target: ${targets.RN}%)`, value: `${rnRasio.toFixed(2)}%`, color: rnRasio >= targets.RN ? 'bg-[#eafaf1] text-[#22c55e]' : 'bg-amber-50 text-amber-500' },
    { key: 'RW', label: `Rasio Wilayah (Target: ${targets.RW}%)`, value: `${rwRasio.toFixed(2)}%`, color: rwRasio >= targets.RW ? 'bg-[#eafaf1] text-[#22c55e]' : 'bg-amber-50 text-amber-500' },
  ];

  const chartConfig = {
    int: { label: "Internasional", color: CHART_COLORS.int },
    nas: { label: "Nasional",      color: CHART_COLORS.nas },
    wil: { label: "Wilayah",       color: CHART_COLORS.wil },
  };

  const barConfig = {
    value: { label: "Jumlah Prestasi", color: "#50c878" },
  };

  const tsNum = parseInt(tahunSasaran);
  const rmNum = parseInt(rentangMode);
  const startYear = tsNum - rmNum + 1;
  const rentangLabel = `${startYear}-${tsNum}`;

  // Paginasi tabel
  const totalTablePages = Math.ceil(prestasiList.length / TABLE_PAGE_SIZE);
  const pagedPrestasi = prestasiList.slice((tablePage - 1) * TABLE_PAGE_SIZE, tablePage * TABLE_PAGE_SIZE);

  return (
    <div className="flex flex-col gap-6 pb-8 font-sans animate-in fade-in duration-500 relative">
      {loading && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <Loader2 className="animate-spin text-[#50c878] h-10 w-10" />
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-[28px] font-bold text-[#1a1a1a] tracking-tight">Dashboard Kaprodi</h1>
        <p className="text-gray-500 text-[15px] mt-1">Ringkasan prestasi mahasiswa Program Studi Teknik Industri</p>
      </div>

      {/* Hero Card */}
      <div className="bg-[#50c878] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-lg shadow-[#50c878]/20">
        <div className="relative z-10 text-white">
          <p className="text-white/80 font-medium text-[14px]">Total Prestasi Mahasiswa (Teknik Industri)</p>
          <div className="flex items-end gap-3 mt-1">
            <h2 className="text-4xl font-bold tracking-tight">{totalPrestasi} Prestasi</h2>
          </div>
          <p className="text-white/80 text-[13px] mt-2">Periode {rentangMode} Tahun Terakhir ({rentangLabel})</p>
        </div>
        <Button onClick={() => setFilterOpen(true)} className="relative z-10 bg-white/20 hover:bg-white/30 text-white border-0 h-10 px-4 rounded-xl text-[14px] font-medium backdrop-blur-sm shadow-none transition-colors">
          Filter Rentang Waktu
        </Button>
        <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[14px] font-medium text-gray-500">Total Prestasi Valid</p>
            <div className="h-10 w-10 rounded-xl bg-[#eafaf1] text-[#50c878] flex justify-center items-center">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-auto">{totalPrestasi}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[14px] font-medium text-gray-500">Mahasiswa Berprestasi</p>
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-500 flex justify-center items-center">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-auto">{uniqueMahasiswa}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[14px] font-medium text-gray-500">Pencapaian Target LAM TEKNIK</p>
            <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-500 flex justify-center items-center">
              <Target className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-auto">{pctTarget}%</p>
        </div>
      </div>

      {/* Sub Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { title: "Prestasi Internasional", val: rekapAuto.NI },
          { title: "Prestasi Nasional",      val: rekapAuto.NN },
          { title: "Prestasi Wilayah",       val: rekapAuto.NW },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex flex-col gap-1">
            <p className="text-[13px] font-medium text-gray-500">{stat.title}</p>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-2xl font-bold text-gray-900 leading-none">{stat.val}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart — Tren per Level */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6 md:p-8">
          <h2 className="text-[16px] font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#50c878]" />Tren Prestasi {rentangMode} Tahun
          </h2>
          <div className="h-[250px] w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <LineChart accessibilityLayer data={trendData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="year" tickLine={false} axisLine={false} tickMargin={8} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} tick={{ fill: '#94a3b8', fontSize: 12 }} width={30} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Line type="monotone" dataKey="int" stroke={CHART_COLORS.int} strokeWidth={2} dot={{ r: 4, fill: "white", strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="nas" stroke={CHART_COLORS.nas} strokeWidth={2} dot={{ r: 4, fill: "white", strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="wil" stroke={CHART_COLORS.wil} strokeWidth={2} dot={{ r: 4, fill: "white", strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ChartContainer>
          </div>
          <div className="flex flex-wrap gap-5 mt-4 justify-center">
            {([
              [CHART_COLORS.int, 'Internasional'],
              [CHART_COLORS.nas, 'Nasional'],
              [CHART_COLORS.wil, 'Wilayah'],
            ] as [string, string][]).map(([c, l]) => (
              <div key={l} className="flex items-center gap-1.5">
                <span className="w-8 h-0.5 rounded-full" style={{ backgroundColor: c }} />
                <span className="text-[12px] font-medium text-gray-500">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart — Distribusi Kategori */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6 md:p-8">
          <h2 className="text-[16px] font-semibold text-gray-900 mb-6 flex items-center gap-2">
            Distribusi Kategori
          </h2>
          <div className="h-[250px] w-full">
            <ChartContainer config={barConfig} className="h-full w-full">
              <RechartsBarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} tick={{ fill: '#94a3b8', fontSize: 12 }} width={30} />
                <ChartTooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} barSize={80} />
              </RechartsBarChart>
            </ChartContainer>
          </div>
        </div>
      </div>

      {/* Scorecard */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6 md:p-8">
        <h2 className="text-[16px] font-semibold text-gray-900 mb-2">Scorecard Indikator Akreditasi</h2>
        {nmtsVal === null && <p className="text-red-500 text-[13px] mb-4">Catatan: Nilai NM(TS) belum diatur. Silakan atur di Master Data untuk menampilkan Rasio aktual.</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {scorecardData.map((item, i) => {
            const bgMatch = item.color.match(/bg-\S+/);
            const textMatch = item.color.match(/text-\S+/);
            const bg = bgMatch ? bgMatch[0] : '';
            const textcolor = textMatch ? textMatch[0] : '';
            return (
              <div key={i} className={`rounded-xl p-5 border border-transparent hover:border-gray-200 transition-colors ${bg}`}>
                <p className="text-[13px] font-medium text-gray-600 mb-3">{item.label}</p>
                <span className={`text-[32px] tracking-tight font-bold ${textcolor}`}>{item.value}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Tabel Data Prestasi Valid ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[16px] font-semibold text-gray-900">Data Prestasi Valid — Teknik Industri</h2>
            <p className="text-[13px] text-gray-500 mt-0.5">Periode {rentangLabel} · {prestasiList.length} data</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left font-semibold text-gray-600 w-8">No</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Nama</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">NIM</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Angkatan</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Nama Prestasi</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Jenis</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Hasil</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Tingkat</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Tipe</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Tahun</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pagedPrestasi.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-10 text-center text-gray-400">
                    Belum ada data prestasi valid pada periode ini.
                  </td>
                </tr>
              ) : (
                pagedPrestasi.map((d: any, idx: number) => (
                  <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3 text-gray-400">{(tablePage - 1) * TABLE_PAGE_SIZE + idx + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{d.mahasiswa?.user?.name ?? '-'}</td>
                    <td className="px-4 py-3 text-gray-600 font-mono text-[12px]">{d.mahasiswa?.nim ?? '-'}</td>
                    <td className="px-4 py-3 text-gray-600">{d.angkatan}</td>
                    <td className="px-4 py-3 text-gray-800 max-w-[180px] truncate" title={d.namaPrestasi}>{d.namaPrestasi}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-600">
                        {d.jenisLomba === 'BELMAWA' ? 'Belmawa' : 'Mandiri'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{d.hasilCapaian}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#eafaf1] text-[#22c55e]">
                        {d.tingkat?.nama ?? '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        d.tipePartisipasi === 'TIM'
                          ? 'bg-purple-50 text-purple-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {d.tipePartisipasi === 'TIM' ? 'Tim' : 'Individu'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{d.tahun}</td>
                    <td className="px-4 py-3 text-center">
                      <Link
                        href={`/kaprodi/dashboard/detail/${d.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#50c878]/10 text-[#22c55e] hover:bg-[#50c878]/20 transition-colors text-[12px] font-medium"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalTablePages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <p className="text-[13px] text-gray-500">
              Halaman {tablePage} dari {totalTablePages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setTablePage((p) => Math.max(1, p - 1))}
                disabled={tablePage === 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setTablePage((p) => Math.min(totalTablePages, p + 1))}
                disabled={tablePage === totalTablePages}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Filter Dialog */}
      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogPortal>
          <DialogOverlay className="bg-black/40 backdrop-blur-sm" />
          <DialogContent className="sm:max-w-[420px] p-6 bg-white rounded-2xl gap-0 shadow-2xl">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-[18px] font-semibold text-gray-900">Filter Rentang Waktu</DialogTitle>
              <DialogDescription className="text-[14px] text-gray-500">Pilih TS dan rentang evaluasi indikator</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="space-y-1.5 flex flex-col">
                <label className="text-[14px] font-medium text-gray-900">Tahun Sasaran (TS)</label>
                <Select value={tahunSasaran} onValueChange={onSelectChange(setTahunSasaran)}>
                  <SelectTrigger className="bg-white rounded-lg h-11 border-gray-200 text-[14px] w-full focus:ring-2 focus:ring-[#50c878]/20 focus:border-[#50c878]">
                    <SelectValue placeholder="Pilih Tahun Sasaran" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map(y => (
                      <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 flex flex-col">
                <label className="text-[14px] font-medium text-gray-900">Rentang Waktu</label>
                <Select value={rentangMode} onValueChange={onSelectChange(setRentangMode)}>
                  <SelectTrigger className="bg-white rounded-lg h-11 border-gray-200 text-[14px] w-full focus:ring-2 focus:ring-[#50c878]/20 focus:border-[#50c878]">
                    <SelectValue placeholder="Pilih Rentang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Tahun Terakhir</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <Button onClick={() => setFilterOpen(false)} className="flex-1 bg-[#006400] hover:bg-[#004d00] text-white rounded-xl h-11 text-[14px] font-semibold flex items-center justify-center">
                Terapkan
              </Button>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
