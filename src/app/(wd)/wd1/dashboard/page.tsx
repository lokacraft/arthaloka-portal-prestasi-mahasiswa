"use client";

import React, { useState, useEffect } from 'react';
import { TrendingUp, Award, ExternalLink, Filter, Users, Target, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogOverlay, DialogPortal } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getRekapLengkap, getTrendPrestasi, getNmTs, getTargets } from '@/server/akreditasi-actions';
import { toast } from 'sonner';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, CartesianGrid, XAxis, YAxis, Line, BarChart as RechartsBarChart, Bar } from 'recharts';

function onSelectChange(setter: React.Dispatch<React.SetStateAction<any>>) {
  return (value: string | null) => { if (value !== null) setter(value); };
}

export default function WdDashboardPage() {
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

  useEffect(() => {
    fetchData();
  }, [tahunSasaran, rentangMode]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const ts = parseInt(tahunSasaran);
      const rm = parseInt(rentangMode);

      const [trend, nmts, targetData, details] = await Promise.all([
        getTrendPrestasi(ts, rm),
        getNmTs(ts),
        getTargets(ts),
        getRekapLengkap({ startYear: ts - rm + 1, endYear: ts })
      ]);

      setTrendData(trend);
      if (nmts) setNmtsVal(nmts.nilai);
      if (targetData) {
        setTargets({
          RI: targetData.ri || 0.05,
          RN: targetData.rn || 0.5,
          RW: targetData.rw || 1.5
        });
      }

      setTotalPrestasi(details.length);
      const uniqueNims = new Set(details.map(d => d.mahasiswa?.nim).filter(Boolean));
      setUniqueMahasiswa(uniqueNims.size);

      // Dist Kategori
      let akadCount = 0;
      let nonAkadCount = 0;
      
      let NI = 0; let NN = 0; let NW = 0;

      details.forEach(d => {
        const nama = d.kategori?.nama.toLowerCase() || '';
        const tk = d.tingkat?.nama.toLowerCase() || '';
        
        if (nama.includes('akademik') && !nama.includes('non')) {
          akadCount++;
        } else {
          nonAkadCount++;
        }

        if (tk.includes('internasional')) NI++;
        if (tk.includes('nasional')) NN++;
        if (tk.includes('wilayah') || tk.includes('lokal')) NW++;
      });

      setBarData([
        { label: 'Akademik', value: akadCount },
        { label: 'Non-Akademik', value: nonAkadCount }
      ]);

      setRekapAuto({ NI, NN, NW });

    } catch (error) {
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
    int: { label: "Internasional", color: "#50c878" },
    nas: { label: "Nasional", color: "#22c55e" },
    wil: { label: "Wilayah", color: "#86efac" },
  };

  const barConfig = {
    value: { label: "Jumlah Prestasi", color: "#50c878" },
  };

  const tsNum = parseInt(tahunSasaran);
  const rmNum = parseInt(rentangMode);
  const startYear = tsNum - rmNum + 1;
  const rentangLabel = `${startYear}-${tsNum}`;

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
        <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>
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
          { title: "Prestasi Nasional", val: rekapAuto.NN },
          { title: "Prestasi Wilayah", val: rekapAuto.NW }
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
        {/* Line Chart */}
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
                <Line type="monotone" dataKey="int" stroke="var(--color-int)" strokeWidth={2} dot={{ r: 4, fill: "white", strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="nas" stroke="var(--color-nas)" strokeWidth={2} dot={{ r: 4, fill: "white", strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="wil" stroke="var(--color-wil)" strokeWidth={2} dot={{ r: 4, fill: "white", strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ChartContainer>
          </div>
          <div className="flex flex-wrap gap-5 mt-4 justify-center">
            {([['#50c878','Internasional'],['#22c55e','Nasional'],['#86efac','Wilayah']] as [string, string][]).map(([c, l]) => (
              <div key={l} className="flex items-center gap-1.5">
                <span className="w-8 h-0.5 rounded-full" style={{ backgroundColor: c }}></span>
                <span className="text-[12px] font-medium text-gray-500">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
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
                      <SelectItem value="3">3 Tahun Terakhir</SelectItem>
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
