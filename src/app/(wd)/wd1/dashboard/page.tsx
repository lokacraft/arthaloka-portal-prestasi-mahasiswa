"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, Award, Users, Target, Loader2, ChevronLeft, ChevronRight, ExternalLink, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogOverlay, DialogPortal } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  getRekapLengkap,
  getTrendPrestasi,
  getNmTs,
  getTargets,
  getTrendPerProdi,
  getDistribusiKategoriPerProdi,
} from '@/server/akreditasi-actions';
import { toast } from 'sonner';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { LineChart, CartesianGrid, XAxis, YAxis, Line, BarChart as RechartsBarChart, Bar } from 'recharts';
import { computeIndikator43 } from '@/lib/lam-skor';

function onSelectChange(setter: React.Dispatch<React.SetStateAction<any>>) {
  return (value: string | null) => { if (value !== null) setter(value); };
}

// Warna kontras untuk 3 level
const CHART_COLORS = {
  int: '#6366f1', // indigo
  nas: '#f59e0b', // amber
  wil: '#50c878', // hijau (brand)
};

// Warna per prodi
const PRODI_COLORS: Record<string, string> = {
  ti:  '#6366f1', // Teknik Industri    — indigo
  tl:  '#f59e0b', // Teknik Logistik   — amber
  mri: '#50c878', // Mgt Rekayasa Ind  — hijau
};

const TABLE_PAGE_SIZE = 10;

// Tipe untuk meta prodi (dari server)
interface ProdiMeta { id: string; nama: string; key: string }

export default function WdDashboardPage() {
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - 5 + i).reverse();

  const [filterOpen, setFilterOpen] = useState(false);
  const [tahunSasaran, setTahunSasaran] = useState(currentYear.toString());
  const [rentangMode, setRentangMode] = useState('5');

  // Data states — utama
  const [loading, setLoading] = useState(true);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [nmtsVal, setNmtsVal] = useState<number | null>(null);
  const [targets, setTargets] = useState({ RI: 0.05, RN: 0.5, RW: 1.5 });
  const [totalPrestasi, setTotalPrestasi] = useState(0);
  const [uniqueMahasiswa, setUniqueMahasiswa] = useState(0);
  const [barData, setBarData] = useState<any[]>([]);
  const [rekapAuto, setRekapAuto] = useState({ NI: 0, NN: 0, NW: 0 });

  // Data states — chart baru
  const [trendPerProdiData, setTrendPerProdiData] = useState<any[]>([]);
  const [distribusiPerProdiData, setDistribusiPerProdiData] = useState<any[]>([]);
  const [prodiMetaList, setProdiMetaList] = useState<ProdiMeta[]>([]);

  // Tabel semua prestasi valid
  const [allPrestasiList, setAllPrestasiList] = useState<any[]>([]);
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
      const startYr = ts - rm + 1;

      const [trend, nmts, targetData, details, trendProdi, distribusiProdi] = await Promise.all([
        getTrendPrestasi(ts, rm, 'Semua'),
        getNmTs(ts),
        getTargets(),
        getRekapLengkap({ startYear: startYr, endYear: ts, programStudiId: 'Semua' }),
        getTrendPerProdi(ts, rm),
        getDistribusiKategoriPerProdi(startYr, ts),
      ]);

      setTrendData(trend);
      setAllPrestasiList(details);

      // Chart baru
      setTrendPerProdiData(trendProdi.data);
      setProdiMetaList(trendProdi.prodiList);
      setDistribusiPerProdiData(distribusiProdi.data);

      if (nmts && !Array.isArray(nmts)) setNmtsVal(nmts.jumlahMahasiswa);
      if (targetData) {
        setTargets({
          RI: targetData.find((t: any) => t.kodeTarget === 'RI')?.nilaiPersen || 0.05,
          RN: targetData.find((t: any) => t.kodeTarget === 'RN')?.nilaiPersen || 0.5,
          RW: targetData.find((t: any) => t.kodeTarget === 'RW')?.nilaiPersen || 1.5,
        });
      }

      setTotalPrestasi(details.length);
      const uniqueNims = new Set<string>();
      details.forEach((d: any) => {
        if (d.mahasiswa?.nim) uniqueNims.add(d.mahasiswa.nim);
        if (d.tipePartisipasi === 'TIM' && Array.isArray(d.anggotaTim)) {
          (d.anggotaTim as { nim: string; nama: string; angkatan?: number }[]).forEach((a) => {
            if (a.nim) uniqueNims.add(a.nim);
          });
        }
      });
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



  const scorecardData = [
    { key: 'NI', label: 'Capaian Internasional (NI)', value: rekapAuto.NI.toString(), color: 'bg-[#eafaf1] text-[#22c55e]' },
    { key: 'NN', label: 'Capaian Nasional (NN)', value: rekapAuto.NN.toString(), color: 'bg-[#eafaf1] text-[#22c55e]' },
    { key: 'NW', label: 'Capaian Wilayah/Lokal (NW)', value: rekapAuto.NW.toString(), color: 'bg-[#eafaf1] text-[#22c55e]' },
    { key: 'RI', label: `Rasio Internasional (Target: ${targets.RI}%)`, value: `${riRasio.toFixed(2)}%`, color: riRasio >= targets.RI ? 'bg-[#eafaf1] text-[#22c55e]' : 'bg-amber-50 text-amber-500' },
    { key: 'RN', label: `Rasio Nasional (Target: ${targets.RN}%)`, value: `${rnRasio.toFixed(2)}%`, color: rnRasio >= targets.RN ? 'bg-[#eafaf1] text-[#22c55e]' : 'bg-amber-50 text-amber-500' },
    { key: 'RW', label: `Rasio Wilayah (Target: ${targets.RW}%)`, value: `${rwRasio.toFixed(2)}%`, color: rwRasio >= targets.RW ? 'bg-[#eafaf1] text-[#22c55e]' : 'bg-amber-50 text-amber-500' },
  ];

  const scorecardsPerProdi = prodiMetaList.map((prodi) => {
    const prodiPrestasi = allPrestasiList.filter((d: any) => d.programStudiId === prodi.id);
    
    let pNI = 0; let pNN = 0; let pNW = 0;
    prodiPrestasi.forEach((d: any) => {
      const tk = d.tingkat?.nama?.toLowerCase() || '';
      if (tk.includes('internasional')) pNI++;
      else if (tk.includes('nasional')) pNN++;
      else if (tk.includes('wilayah') || tk.includes('lokal')) pNW++;
    });

    const pRiRasio = rasioAuto(pNI);
    const pRnRasio = rasioAuto(pNN);
    const pRwRasio = rasioAuto(pNW);

    return {
      prodiId: prodi.key,
      prodiName: prodi.nama,
      metrics: [
        { label: `Internasional (${pNI})`, value: `${pRiRasio.toFixed(2)}%`, color: pRiRasio >= targets.RI ? 'bg-[#eafaf1] text-[#22c55e]' : 'bg-amber-50 text-amber-500' },
        { label: `Nasional (${pNN})`, value: `${pRnRasio.toFixed(2)}%`, color: pRnRasio >= targets.RN ? 'bg-[#eafaf1] text-[#22c55e]' : 'bg-amber-50 text-amber-500' },
        { label: `Wilayah (${pNW})`, value: `${pRwRasio.toFixed(2)}%`, color: pRwRasio >= targets.RW ? 'bg-[#eafaf1] text-[#22c55e]' : 'bg-amber-50 text-amber-500' },
      ]
    };
  });

  // LAM TEKNIK Indikator 43 — skor per prodi
  const lamSkorPerProdi = prodiMetaList.map((prodi) => {
    const prodiPrestasi = allPrestasiList.filter((d: any) => d.programStudiId === prodi.id);
    const akad = { NI: 0, NN: 0, NW: 0 };
    const nonAkad = { NI: 0, NN: 0, NW: 0 };
    prodiPrestasi.forEach((d: any) => {
      const katNama = d.kategori?.nama?.toLowerCase() || '';
      const isAkademik = katNama.includes('akademik') && !katNama.includes('non');
      const tk = d.tingkat?.nama?.toLowerCase() || '';
      const tgt = isAkademik ? akad : nonAkad;
      if (tk.includes('internasional')) tgt.NI++;
      else if (tk.includes('nasional')) tgt.NN++;
      else if (tk.includes('wilayah') || tk.includes('lokal')) tgt.NW++;
    });
    const NM = nmtsVal ?? 0;
    const a = targets.RI / 100;
    const b = targets.RN / 100;
    const result = computeIndikator43(akad, nonAkad, nmtsVal, targets);
    return {
      prodi,
      akad,
      nonAkad,
      riAkad: NM > 0 ? (akad.NI / NM) * 100 : 0,
      rnAkad: NM > 0 ? (akad.NN / NM) * 100 : 0,
      rwAkad: NM > 0 ? (akad.NW / NM) * 100 : 0,
      meetsScore4Akad: NM > 0 && akad.NI / NM > a && akad.NN / NM > b,
      ...result,
    };
  });

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

  // ChartConfig untuk tren per prodi (dinamis dari prodiMetaList)
  const prodiChartConfig = prodiMetaList.reduce<Record<string, { label: string; color: string }>>((acc, p) => {
    acc[p.key] = { label: p.nama, color: PRODI_COLORS[p.key] ?? '#94a3b8' };
    return acc;
  }, {});

  // ChartConfig untuk distribusi per prodi
  const distribusiChartConfig = prodiMetaList.reduce<Record<string, { label: string; color: string }>>((acc, p) => {
    acc[p.key] = { label: p.nama, color: PRODI_COLORS[p.key] ?? '#94a3b8' };
    return acc;
  }, {});

  // Paginasi tabel
  const totalTablePages = Math.ceil(allPrestasiList.length / TABLE_PAGE_SIZE);
  const pagedPrestasi = allPrestasiList.slice((tablePage - 1) * TABLE_PAGE_SIZE, tablePage * TABLE_PAGE_SIZE);

  return (
    <div className="flex flex-col gap-6 pb-8 font-sans animate-in fade-in duration-500 relative">
      {loading && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <Loader2 className="animate-spin text-[#50c878] h-10 w-10" />
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-[28px] font-bold text-[#1a1a1a] tracking-tight">Executive Dashboard</h1>
        <p className="text-gray-500 text-[15px] mt-1">Ringkasan prestasi mahasiswa tingkat pimpinan fakultas</p>
      </div>

      {/* Hero Card */}
      <div className="bg-[#50c878] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-lg shadow-[#50c878]/20">
        <div className="relative z-10 text-white">
          <p className="text-white/80 font-medium text-[14px]">Total Prestasi Mahasiswa</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
      </div>

      {/* ── Skor LAM TEKNIK per Program Studi — Indikator 43 ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6 md:p-8">
        <div className="flex items-center gap-2 mb-1">
          <Target className="h-5 w-5 text-purple-500" />
          <h2 className="text-[16px] font-semibold text-gray-900">Skor LAM TEKNIK</h2>
        </div>
        <p className="text-[13px] text-gray-400 mb-5">
          Prestasi akademik &amp; nonakademik per program studi · Total Mahasiswa (NM) = <span className="font-semibold text-gray-600">{nmtsVal ?? 'Belum diatur'}</span> · Skor = ((Akademik × 3) + Non-Akademik) / 4
        </p>
        {nmtsVal === null && (
          <p className="text-amber-600 text-[13px] bg-amber-50 rounded-lg px-3 py-2 mb-5 border border-amber-100">
            ⚠ Nilai NM(TS) belum diatur, skor tidak dapat dihitung. Silakan atur di Master Data.
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {lamSkorPerProdi.map((item) => (
            <div
              key={item.prodi.id}
              className={`rounded-xl border p-5 flex flex-col gap-3 ${
                item.isScore4 ? 'border-emerald-100 bg-emerald-50/30' : 'border-gray-100 bg-gray-50/40'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">LAM TEKNIK</p>
                  <p className="text-[13px] font-semibold text-gray-800 mt-0.5 leading-tight">{item.prodi.nama}</p>
                </div>
                <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  item.isScore4 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {item.isScore4 ? '✓ Skor 4' : 'Belum 4'}
                </span>
              </div>

              {/* Final Score */}
              <div className="flex items-end gap-1">
                <span className={`text-[40px] font-bold tracking-tight leading-none ${
                  item.isScore4 ? 'text-emerald-600' : 'text-gray-900'
                }`}>
                  {nmtsVal ? item.skorFinal.toFixed(2) : '—'}
                </span>
                <span className="text-gray-400 text-[14px] mb-1.5">/ 4</span>
              </div>

              {/* Akademik Breakdown */}
              <div className="rounded-lg bg-white border border-indigo-50 p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 rounded px-1.5 py-0.5">Akademik</span>
                  <span className="text-[13px] font-bold text-gray-800">{nmtsVal ? item.skorAkad.toFixed(2) : '—'}</span>
                </div>
                <div className="flex gap-3 flex-wrap text-[11px]">
                  <span className={item.riAkad > targets.RI ? 'text-emerald-600 font-medium' : 'text-red-400'}>
                    RI {item.riAkad.toFixed(3)}%{item.riAkad > targets.RI ? ' ✓' : ` (>${targets.RI}%)`}
                  </span>
                  <span className={item.rnAkad > targets.RN ? 'text-emerald-600 font-medium' : 'text-red-400'}>
                    RN {item.rnAkad.toFixed(3)}%{item.rnAkad > targets.RN ? ' ✓' : ` (>${targets.RN}%)`}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">
                  NI: {item.akad.NI} · NN: {item.akad.NN} · NW: {item.akad.NW}
                </p>
              </div>

              {/* Non-Akademik Breakdown */}
              <div className="rounded-lg bg-white border border-purple-50 p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-purple-600 bg-purple-50 rounded px-1.5 py-0.5">Non-Akademik</span>
                  <span className="text-[13px] font-bold text-gray-800">{nmtsVal ? item.skorNonAkad.toFixed(2) : '—'}</span>
                </div>
                <p className="text-[11px] text-gray-400">
                  NI: {item.nonAkad.NI} · NN: {item.nonAkad.NN} · NW: {item.nonAkad.NW}
                </p>
              </div>
            </div>
          ))}
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

      {/* ── Chart Row 1: Tren per Level + Distribusi Kategori ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart — Tren per Level */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6 md:p-8">
          <h2 className="text-[16px] font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#50c878]" />Tren Prestasi per Level
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
            <BarChart2 className="h-5 w-5 text-[#50c878]" />Distribusi Kategori
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

      {/* ── Chart Row 2 BARU: Tren per Prodi + Distribusi Akademik per Prodi ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart — Tren per Prodi */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6 md:p-8">
          <h2 className="text-[16px] font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-500" />Tren Prestasi per Program Studi
          </h2>
          <div className="h-[260px] w-full">
            {prodiMetaList.length > 0 ? (
              <ChartContainer config={prodiChartConfig} className="h-full w-full">
                <LineChart accessibilityLayer data={trendPerProdiData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="year" tickLine={false} axisLine={false} tickMargin={8} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} tick={{ fill: '#94a3b8', fontSize: 12 }} width={30} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                  {prodiMetaList.map((p) => (
                    <Line
                      key={p.key}
                      type="monotone"
                      dataKey={p.key}
                      stroke={PRODI_COLORS[p.key] ?? '#94a3b8'}
                      strokeWidth={2}
                      dot={{ r: 4, fill: "white", strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  ))}
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-[13px]">Memuat data...</div>
            )}
          </div>
          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            {prodiMetaList.map((p) => (
              <div key={p.key} className="flex items-center gap-1.5">
                <span className="w-8 h-0.5 rounded-full" style={{ backgroundColor: PRODI_COLORS[p.key] ?? '#94a3b8' }} />
                <span className="text-[12px] font-medium text-gray-500">{p.nama}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart Grouped — Akademik vs Non-Akademik per Prodi */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6 md:p-8">
          <h2 className="text-[16px] font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-amber-500" />Distribusi Kategori per Program Studi
          </h2>
          <div className="h-[260px] w-full">
            {prodiMetaList.length > 0 ? (
              <ChartContainer config={distribusiChartConfig} className="h-full w-full">
                <RechartsBarChart
                  data={distribusiPerProdiData}
                  margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
                  barCategoryGap="35%"
                  barGap={4}
                >
                  <CartesianGrid vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} tick={{ fill: '#94a3b8', fontSize: 12 }} width={30} allowDecimals={false} />
                  <ChartTooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} content={<ChartTooltipContent />} />
                  {prodiMetaList.map((p) => (
                    <Bar
                      key={p.key}
                      dataKey={p.key}
                      name={p.nama}
                      fill={PRODI_COLORS[p.key] ?? '#94a3b8'}
                      radius={[4, 4, 0, 0]}
                      maxBarSize={40}
                    />
                  ))}
                </RechartsBarChart>
              </ChartContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-[13px]">Memuat data...</div>
            )}
          </div>
          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            {prodiMetaList.map((p) => (
              <div key={p.key} className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: PRODI_COLORS[p.key] ?? '#94a3b8' }} />
                <span className="text-[12px] font-medium text-gray-500">{p.nama}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scorecard */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6 md:p-8">
        <h2 className="text-[16px] font-semibold text-gray-900 mb-2">Scorecard Indikator Akreditasi (Global)</h2>
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

      {/* Scorecard Per Prodi */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6 md:p-8">
        <h2 className="text-[16px] font-semibold text-gray-900 mb-4">Score Card Indikator Akreditasi Berdasar Program Studi</h2>
        <div className="space-y-4">
          {scorecardsPerProdi.map((prodiData, idx) => (
            <div key={idx} className="p-5 rounded-xl border border-gray-100 bg-gray-50/50">
              <h3 className="text-[15px] font-semibold text-gray-800 mb-4">{prodiData.prodiName}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {prodiData.metrics.map((item, i) => {
                  const bgMatch = item.color.match(/bg-\S+/);
                  const textMatch = item.color.match(/text-\S+/);
                  const bg = bgMatch ? bgMatch[0] : '';
                  const textcolor = textMatch ? textMatch[0] : '';
                  return (
                    <div key={i} className={`rounded-xl p-4 border border-transparent transition-colors ${bg}`}>
                      <p className="text-[12px] font-medium text-gray-600 mb-2">{item.label}</p>
                      <span className={`text-[24px] tracking-tight font-bold ${textcolor}`}>{item.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tabel Data Prestasi Valid — Semua Jurusan ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[16px] font-semibold text-gray-900">Data Prestasi Valid - Semua Program Studi</h2>
            <p className="text-[13px] text-gray-500 mt-0.5">Periode {rentangLabel} · {allPrestasiList.length} data</p>
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
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Prodi</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Nama Prestasi</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Kategori</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Jenis</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Hasil</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Tingkat</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Tipe</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Anggota Tim</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Tahun</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pagedPrestasi.length === 0 ? (
                <tr>
                  <td colSpan={14} className="px-4 py-10 text-center text-gray-400">
                    Belum ada data prestasi valid pada periode ini.
                  </td>
                </tr>
              ) : (
                pagedPrestasi.map((d: any, idx: number) => {
                  const anggota: { nim: string; nama: string; angkatan?: number }[] =
                    d.tipePartisipasi === 'TIM' && Array.isArray(d.anggotaTim)
                      ? d.anggotaTim
                      : [];
                  return (
                    <React.Fragment key={d.id}>
                      <tr className={`border-b border-gray-50 hover:bg-gray-50/60 transition-colors${anggota.length > 0 ? ' border-b-0' : ''}`}>
                        <td className="px-4 py-3 text-gray-400" rowSpan={anggota.length > 0 ? 2 : 1}>{(tablePage - 1) * TABLE_PAGE_SIZE + idx + 1}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{d.mahasiswa?.user?.name ?? '-'}</td>
                        <td className="px-4 py-3 text-gray-600 font-mono text-[12px]">{d.mahasiswa?.nim ?? '-'}</td>
                        <td className="px-4 py-3 text-gray-600">{d.angkatan}</td>
                        <td className="px-4 py-3 text-gray-600 text-[12px]">{d.programStudi?.nama ?? '-'}</td>
                        <td className="px-4 py-3 text-gray-800">{d.namaPrestasi}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            d.kategori?.nama?.toLowerCase().includes('non')
                              ? 'bg-orange-50 text-orange-600'
                              : 'bg-indigo-50 text-indigo-600'
                          }`}>
                            {d.kategori?.nama ?? '-'}
                          </span>
                        </td>
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
                        <td className="px-4 py-3 text-gray-600 font-medium">
                          {d.tipePartisipasi === 'TIM' ? anggota.length : '-'}
                        </td>
                        <td className="px-4 py-3 text-gray-600" rowSpan={anggota.length > 0 ? 2 : 1}>{d.tahun}</td>
                        <td className="px-4 py-3 text-center" rowSpan={anggota.length > 0 ? 2 : 1}>
                          <Link
                            href={`/wd1/dashboard/detail/${d.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#50c878]/10 text-[#22c55e] hover:bg-[#50c878]/20 transition-colors text-[12px] font-medium"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Detail
                          </Link>
                        </td>
                      </tr>
                      {anggota.length > 0 && (
                        <tr className="border-b border-gray-50 bg-purple-50/30">
                          <td colSpan={11} className="px-4 pb-3 pt-0 align-top">
                            <div className="flex items-start gap-2">
                              <span className="text-[10px] font-semibold text-purple-500 tracking-wide mt-1 shrink-0">Anggota Tim</span>
                              <div className="flex flex-col gap-1.5">
                                {anggota.map((a, i) => (
                                  <div key={i} className="flex items-center gap-3 bg-white border border-purple-100 rounded-lg px-3 py-1.5">
                                    <span className="font-mono text-[12px] font-semibold text-purple-700">{a.nim}</span>
                                    <span className="text-gray-700 text-[12px]">{a.nama}</span>
                                    <span className="text-gray-400 text-[11px]">Angkatan {a.angkatan ?? d.angkatan}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
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
              {/* Select Program Studi — DISABLED sementara */}
              {/* <div className="space-y-1.5 flex flex-col">
                <label className="text-[14px] font-medium text-gray-400">Program Studi</label>
                <SelectTrigger
                  disabled
                  className="bg-gray-50 rounded-lg h-11 border-gray-200 text-[14px] w-full opacity-50 cursor-not-allowed pointer-events-none"
                >
                  <SelectValue placeholder="Semua Program Studi">Semua Program Studi</SelectValue>
                </SelectTrigger>
                <p className="text-[12px] text-gray-400 italic">Filter program studi sementara dinonaktifkan</p>
              </div> */}
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
