"use client";

import React, { useState, useEffect } from 'react';
import { Download, TrendingUp, CheckCircle2, ExternalLink, Filter, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogOverlay, DialogPortal } from '@/components/ui/dialog';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { 
  getTargets, 
  getNmTs, 
  getKategoriPrestasi, 
  getRekapPrestasiAkreditasi, 
  getTrendPrestasi,
  getRekapLengkap
} from '@/server/akreditasi-actions';

const levelColor: Record<string, string> = {
  Internasional: 'bg-blue-50 text-blue-600 border border-blue-100',
  Nasional: 'bg-[#eafaf1] text-[#50c878] border border-[#50c878]/20',
  Wilayah: 'bg-amber-50 text-amber-600 border border-amber-100',
};

// Base UI onValueChange handler wrapper
function onSelectChange(setter: React.Dispatch<React.SetStateAction<any>>) {
  return (value: string | null) => { if (value !== null) setter(value); };
}

export default function DashboardAkreditasiPage() {
  const [exportOpen, setExportOpen] = useState(false);
  const [exportMode, setExportMode] = useState<'all' | 'filtered'>('all');
  
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  // Filters
  const [tahunSasaran, setTahunSasaran] = useState(currentYear.toString());
  const [rentangMode, setRentangMode] = useState<'5'>('5');
  const [kategoriFilter, setKategoriFilter] = useState('Semua');
  const [levelFilter, setLevelFilter] = useState('Semua');

  // Master Data
  const [kategoriList, setKategoriList] = useState<{id: string, nama: string}[]>([]);
  const [nmtsVal, setNmtsVal] = useState<number | null>(null);
  const [targets, setTargets] = useState<{ RI: number, RN: number, RW: number }>({ RI: 0.2, RN: 2.0, RW: 4.0 });

  // Computed Data
  const [loading, setLoading] = useState(true);
  const [rekapAuto, setRekapAuto] = useState<{ NI: number, NN: number, NW: number }>({ NI: 0, NN: 0, NW: 0 });
  const [trendData, setTrendData] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [tahunSasaran, rentangMode, kategoriFilter, levelFilter]);

  const fetchInitialData = async () => {
    try {
      const [dbTargets, kats] = await Promise.all([
        getTargets(),
        getKategoriPrestasi()
      ]);
      
      const newT = { RI: 0.2, RN: 2.0, RW: 4.0 };
      dbTargets.forEach(t => {
        if (t.kodeTarget === 'RI') newT.RI = t.nilaiPersen;
        if (t.kodeTarget === 'RN') newT.RN = t.nilaiPersen;
        if (t.kodeTarget === 'RW') newT.RW = t.nilaiPersen;
      });
      setTargets(newT);
      setKategoriList(kats);
    } catch (error) {
      toast.error("Gagal memuat data master");
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const ts = parseInt(tahunSasaran);
      const rentang = parseInt(rentangMode);

      const [nmtsDoc, rekap, trend, details] = await Promise.all([
        getNmTs(ts),
        getRekapPrestasiAkreditasi(ts, rentang, kategoriFilter),
        getTrendPrestasi(ts),
        getRekapLengkap({ 
          tahun: levelFilter !== 'Semua' ? undefined : undefined, // we fetch all for the last 5 years based on TS
        })
      ]);

      // @ts-ignore
      setNmtsVal(nmtsDoc ? nmtsDoc.jumlahMahasiswa : null);
      setRekapAuto(rekap);
      setTrendData(trend);
      
      // Filter detailed data based on TS and Rentang (which is 5 years for the table as requested "Rekap Data 5 Tahun Terakhir")
      const startYearTable = ts - 4;
      let filteredDetails = details.filter(d => d.tahun >= startYearTable && d.tahun <= ts);
      
      if (kategoriFilter !== 'Semua') {
        if (kategoriFilter === 'Akademik') {
          filteredDetails = filteredDetails.filter(d => d.kategori.nama.toLowerCase().includes('akademik'));
        } else if (kategoriFilter === 'Non-Akademik') {
          filteredDetails = filteredDetails.filter(d => !d.kategori.nama.toLowerCase().includes('akademik'));
        } else {
          filteredDetails = filteredDetails.filter(d => d.kategoriId === kategoriFilter);
        }
      }
      
      if (levelFilter !== 'Semua') {
        filteredDetails = filteredDetails.filter(d => d.tingkat.nama.toLowerCase() === levelFilter.toLowerCase());
      }
      
      // ----------------------------------------------------
      // Compute 10-row summary for the Table
      // ----------------------------------------------------
      const summaryRows = [];
      for (let y = ts; y >= startYearTable; y--) {
        // Akademik
        const akad = filteredDetails.filter(d => {
          const nama = d.kategori?.nama.toLowerCase() || '';
          return d.tahun === y && nama.includes('akademik') && !nama.includes('non');
        });
        summaryRows.push({
          tahun: y,
          kategori: 'Akademik',
          int: akad.filter(d => d.tingkat?.nama.toLowerCase().includes('internasional')).length,
          nas: akad.filter(d => d.tingkat?.nama.toLowerCase().includes('nasional')).length,
          wil: akad.filter(d => d.tingkat?.nama.toLowerCase().includes('wilayah') || d.tingkat?.nama.toLowerCase().includes('lokal')).length,
          total: akad.length
        });

        // Non-Akademik
        const nonAkad = filteredDetails.filter(d => {
          const nama = d.kategori?.nama.toLowerCase() || '';
          return d.tahun === y && (!nama.includes('akademik') || nama.includes('non'));
        });
        summaryRows.push({
          tahun: y,
          kategori: 'Non-Akademik',
          int: nonAkad.filter(d => d.tingkat?.nama.toLowerCase().includes('internasional')).length,
          nas: nonAkad.filter(d => d.tingkat?.nama.toLowerCase().includes('nasional')).length,
          wil: nonAkad.filter(d => d.tingkat?.nama.toLowerCase().includes('wilayah') || d.tingkat?.nama.toLowerCase().includes('lokal')).length,
          total: nonAkad.length
        });
      }
      setTableData(summaryRows);

    } catch (error) {
      toast.error("Gagal memuat data dashboard");
    } finally {
      setLoading(false);
    }
  };

  const rasioAuto = (val: number) => nmtsVal ? (val / nmtsVal) * 100 : 0;
  
  const indicators = [
    { key: 'NI', label: 'Prestasi Internasional (RI)', value: rekapAuto.NI, target: targets.RI },
    { key: 'NN', label: 'Prestasi Nasional (RN)', value: rekapAuto.NN, target: targets.RN },
    { key: 'NW', label: 'Prestasi Wilayah/Lokal (RW)', value: rekapAuto.NW, target: targets.RW },
  ];

  const handleExport = () => {
    try {
      const wb = XLSX.utils.book_new();

      // 1. Indikator
      const indicatorExport = indicators.map(ind => ({
        "Indikator": ind.label,
        "Capaian (%)": rasioAuto(ind.value).toFixed(2),
        "Target (%)": ind.target,
        "Status": rasioAuto(ind.value) >= ind.target ? "Tercapai" : "Belum Tercapai"
      }));
      const wsIndikator = XLSX.utils.json_to_sheet(indicatorExport);
      XLSX.utils.book_append_sheet(wb, wsIndikator, "Capaian Indikator");

      // 2. Trend Data
      const trendExport = trendData.map((d: any) => ({
        "Tahun": d.year,
        "Internasional": d.int,
        "Nasional": d.nas,
        "Wilayah/Lokal": d.wil,
      }));
      const wsTrend = XLSX.utils.json_to_sheet(trendExport);
      XLSX.utils.book_append_sheet(wb, wsTrend, "Tren Prestasi");

      // 3. Matrix Summary
      const matrixExport = tableData.map((d: any) => ({
        "Tahun": d.tahun,
        "Kategori": d.kategori,
        "Internasional": d.int,
        "Nasional": d.nas,
        "Wilayah/Lokal": d.wil,
        "Total": d.total,
      }));
      const wsMatrix = XLSX.utils.json_to_sheet(matrixExport);
      XLSX.utils.book_append_sheet(wb, wsMatrix, "Matrix 5 Tahun");

      XLSX.writeFile(wb, `Dashboard_Akreditasi_${tahunSasaran}.xlsx`);
      toast.success("Berhasil mengekspor data dashboard");
      setExportOpen(false);
    } catch (error) {
      toast.error("Gagal mengekspor data");
    }
  };

  const chartConfig = {
    int: { label: "Internasional", color: "#50c878" },
    nas: { label: "Nasional", color: "#22c55e" },
    wil: { label: "Wilayah", color: "#86efac" },
  };

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
          <h2 className="text-[14px] font-semibold text-gray-700">Filter Data & Rentang Waktu</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="space-y-1 flex flex-col">
            <label className="text-[12px] font-medium text-gray-400">Tahun Sasaran (TS)</label>
            <Select value={tahunSasaran} onValueChange={onSelectChange(setTahunSasaran)}>
              <SelectTrigger className="bg-[#f8f9fa] rounded-lg h-11 border-gray-200 text-[14px] w-full">
                <SelectValue placeholder="Pilih TS" />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1 flex flex-col">
            <label className="text-[12px] font-medium text-gray-400">Rentang (Untuk Indikator)</label>
            <Select value={rentangMode} onValueChange={onSelectChange(setRentangMode)}>
              <SelectTrigger className="bg-[#f8f9fa] rounded-lg h-11 border-gray-200 text-[14px] w-full">
                <SelectValue placeholder="Rentang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 Tahun Terakhir</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1 flex flex-col">
            <label className="text-[12px] font-medium text-gray-400">Kategori</label>
            <Select value={kategoriFilter} onValueChange={onSelectChange(setKategoriFilter)}>
              <SelectTrigger className="bg-[#f8f9fa] rounded-lg h-11 border-gray-200 text-[14px] w-full">
                <SelectValue placeholder="Semua Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semua">Semua Kategori</SelectItem>
                <SelectItem value="Akademik">Akademik</SelectItem>
                <SelectItem value="Non-Akademik">Non-Akademik</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1 flex flex-col">
            <label className="text-[12px] font-medium text-gray-400">Level</label>
            <Select value={levelFilter} onValueChange={onSelectChange(setLevelFilter)}>
              <SelectTrigger className="bg-[#f8f9fa] rounded-lg h-11 border-gray-200 text-[14px] w-full">
                <SelectValue placeholder="Semua Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semua">Semua Level</SelectItem>
                <SelectItem value="internasional">Internasional</SelectItem>
                <SelectItem value="nasional">Nasional</SelectItem>
                <SelectItem value="wilayah">Wilayah</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Indikator */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6 md:p-8">
        <h2 className="text-[16px] font-semibold text-gray-900 mb-6 flex items-center justify-between">
          <span>Indikator Akreditasi (LAM TEKNIK)</span>
          {nmtsVal === null && <span className="text-red-500 text-[12px] font-medium bg-red-50 px-2 py-1 rounded">NM(TS) Belum Diatur</span>}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          {loading && <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center"><Loader2 className="animate-spin text-[#50c878]" /></div>}
          {indicators.map(ind => {
            const r = rasioAuto(ind.value);
            const met = r >= ind.target;
            const pct = Math.min(100, Math.round((r / ind.target) * 100)) || 0;
            return (
              <div key={ind.key} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <p className="text-[12px] text-gray-500 font-medium mb-2">{ind.label}</p>
                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="text-[28px] font-bold text-gray-900">{ind.value}</span>
                  <span className="text-[12px] text-gray-400">({r.toFixed(2)}%) / {ind.target}% target</span>
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

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6 md:p-8">
        <h2 className="text-[16px] font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-[#50c878]" />Tren Prestasi 5 Tahun (Berdasarkan TS)
        </h2>
        <div className="h-[250px] w-full mt-4">
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
      </div>

      {/* Rekap Table - MATRIX 5 TAHUN */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-[16px] font-semibold text-gray-900">Summary Prestasi 5 Tahun</h2>
            <p className="text-[13px] text-gray-500 mt-1">Matriks rekapitulasi data prestasi mahasiswa</p>
          </div>
        </div>
        <div className="overflow-x-auto relative">
          {loading && <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center"><Loader2 className="animate-spin text-[#50c878]" /></div>}
          <table className="w-full">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                {['Tahun','Kategori','Internasional','Nasional','Wilayah/Lokal','Total'].map(h => (
                  <th key={h} className="text-left py-4 px-6 text-[13px] font-semibold text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tableData.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-[14px] font-medium text-gray-900">{row.tahun}</td>
                  <td className="py-4 px-6 text-[14px] text-gray-700">
                    <span className={`px-2.5 py-1 rounded-md text-[12px] font-medium ${row.kategori === 'Akademik' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                      {row.kategori}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-[14px] font-semibold text-[#50c878]">{row.int}</td>
                  <td className="py-4 px-6 text-[14px] font-semibold text-[#22c55e]">{row.nas}</td>
                  <td className="py-4 px-6 text-[14px] font-semibold text-[#86efac]">{row.wil}</td>
                  <td className="py-4 px-6 text-[14px] font-bold text-gray-900">{row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Dialog */}
      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogPortal>
          <DialogOverlay className="bg-black/40 backdrop-blur-sm" />
          <DialogContent className="sm:max-w-[440px] p-6 bg-white rounded-2xl gap-0 shadow-2xl">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-[18px] font-semibold text-gray-900">Export Summary Excel</DialogTitle>
              <DialogDescription className="text-[14px] text-gray-500">Export matriks 5 tahun di atas ke format Excel</DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setExportOpen(false)} className="flex-1 rounded-xl h-11 text-[14px] border-gray-200">Batal</Button>
              <Button onClick={handleExport} className="flex-1 bg-[#006400] hover:bg-[#004d00] text-white rounded-xl h-11 text-[14px] font-semibold flex items-center justify-center gap-2">
                <Download className="h-4 w-4" />Download .xlsx
              </Button>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
