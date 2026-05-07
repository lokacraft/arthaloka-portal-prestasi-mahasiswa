"use client";

import React, { useState, useEffect } from 'react';
import { Download, Filter, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogOverlay, DialogPortal } from '@/components/ui/dialog';
import { getRekapLengkap, getKategoriPrestasi } from '@/server/akreditasi-actions';
import { getProgramStudiList } from '@/server/prestasi-actions';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

const levelColor: Record<string, string> = {
  Internasional: 'bg-blue-50 text-blue-600 border border-blue-100',
  Nasional: 'bg-[#eafaf1] text-[#50c878] border border-[#50c878]/20',
  Wilayah: 'bg-amber-50 text-amber-600 border border-amber-100',
};

function onSelectChange(setter: React.Dispatch<React.SetStateAction<any>>) {
  return (value: string | null) => { if (value !== null) setter(value); };
}

export default function RekapPage() {
  const [exportOpen, setExportOpen] = useState(false);
  const [exportMode, setExportMode] = useState<'all' | 'filtered'>('all');
  
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - 5 + i).reverse();

  // Filters
  const [tahun, setTahun] = useState('Semua');
  const [kategori, setKategori] = useState('Semua');
  const [level, setLevel] = useState('Semua');
  const [angkatan, setAngkatan] = useState('Semua');
  const [programStudi, setProgramStudi] = useState('Semua');

  // Data
  const [loading, setLoading] = useState(true);
  const [allData, setAllData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [kategoriList, setKategoriList] = useState<{id: string, nama: string}[]>([]);
  const [programStudiList, setProgramStudiList] = useState<{id: string, nama: string}[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tahun, kategori, level, angkatan, programStudi, allData]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [data, kats, prodi] = await Promise.all([
        getRekapLengkap({}),
        getKategoriPrestasi(),
        getProgramStudiList()
      ]);
      setAllData(data);
      setKategoriList(kats);
      setProgramStudiList(prodi);
      
      const ti = prodi.find((p: any) => p.nama.toLowerCase().includes("teknik industri"));
      if (ti) {
        setProgramStudi(ti.id);
      }
    } catch (error) {
      toast.error("Gagal memuat data rekap");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = allData;

    if (tahun !== 'Semua') {
      result = result.filter(d => d.tahun.toString() === tahun);
    }

    if (kategori !== 'Semua') {
      result = result.filter(d => d.kategoriId === kategori);
    }

    if (level !== 'Semua') {
      result = result.filter(d => d.tingkat.nama.toLowerCase() === level.toLowerCase());
    }

    if (angkatan !== 'Semua') {
      result = result.filter(d => d.angkatan && d.angkatan.toString() === angkatan);
    }

    if (programStudi !== 'Semua') {
      result = result.filter(d => d.programStudiId === programStudi);
    }

    setFilteredData(result);
  };

  const totalAkademik = filteredData.filter(d => {
    const nama = d.kategori?.nama.toLowerCase() || '';
    return nama.includes('akademik') && !nama.includes('non');
  }).length;
  const totalNonAkademik = filteredData.length - totalAkademik;
  const totalInternasional = filteredData.filter(d => d.tingkat?.nama.toLowerCase().includes('internasional')).length;

  const handleExport = () => {
    try {
      const dataToExport = exportMode === 'filtered' ? filteredData : allData;
      const exportData = dataToExport.map((d: any, i: number) => ({
        "No": i + 1,
        "Tahun": d.tahun,
        "Semester": d.semester,
        "Nama Kegiatan": d.namaPrestasi,
        "Jenis Lomba": d.jenisLomba || "N/A",
        "Penyelenggara": d.namaPenyelenggara,
        "Nama Mahasiswa": d.mahasiswa?.user?.name || "N/A",
        "NIM": d.mahasiswa?.nim || "N/A",
        "Angkatan": d.angkatan || "N/A",
        "Program Studi": d.programStudi?.nama || "N/A",
        "Kategori": d.kategori?.nama || "N/A",
        "Level": d.tingkat?.nama || "N/A",
        "Tanggal Mulai": d.tanggalMulai ? new Date(d.tanggalMulai).toLocaleDateString("id-ID") : "N/A",
        "Tanggal Selesai": d.tanggalSelesai ? new Date(d.tanggalSelesai).toLocaleDateString("id-ID") : "N/A",
        "URL Sertifikat / Evidence": (d.sertifikatUrls as string[] || []).concat(d.buktiBuktiUrls as string[] || []).join(", ") || "Tidak ada",
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Rekap_Prestasi");
      XLSX.writeFile(wb, `Rekap_Prestasi_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success("Berhasil mengekspor data");
      setExportOpen(false);
    } catch (error) {
      toast.error("Gagal mengekspor data");
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-8 font-sans animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#1a1a1a] tracking-tight">Rekap Prestasi 5 Tahun</h1>
          <p className="text-gray-500 text-[15px] mt-1">Data lengkap prestasi mahasiswa yang telah divalidasi</p>
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
          <div className="flex flex-col space-y-1">
            <label className="text-[12px] font-medium text-gray-400">Tahun</label>
            <Select value={tahun} onValueChange={onSelectChange(setTahun)}>
              <SelectTrigger className="bg-[#f8f9fa] rounded-lg h-11 border-gray-200 text-[14px] w-full">
                <SelectValue placeholder="Semua Tahun" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semua">Semua Tahun</SelectItem>
                {yearOptions.map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-[12px] font-medium text-gray-400">Kategori</label>
            <Select value={kategori} onValueChange={onSelectChange(setKategori)}>
              <SelectTrigger className="bg-[#f8f9fa] rounded-lg h-11 border-gray-200 text-[14px] w-full">
                <SelectValue placeholder="Semua Kategori">
                  {kategori === 'Semua' ? 'Semua Kategori' : kategoriList.find(k => k.id === kategori)?.nama || kategori}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semua">Semua Kategori</SelectItem>
                {kategoriList.map(kat => (
                  <SelectItem key={kat.id} value={kat.id}>{kat.nama}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-[12px] font-medium text-gray-400">Level</label>
            <Select value={level} onValueChange={onSelectChange(setLevel)}>
              <SelectTrigger className="bg-[#f8f9fa] rounded-lg h-11 border-gray-200 text-[14px] w-full">
                <SelectValue placeholder="Semua Level">
                  {level === 'Semua' ? 'Semua Level' : level.charAt(0).toUpperCase() + level.slice(1)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semua">Semua Level</SelectItem>
                <SelectItem value="internasional">Internasional</SelectItem>
                <SelectItem value="nasional">Nasional</SelectItem>
                <SelectItem value="wilayah">Wilayah</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-[12px] font-medium text-gray-400">Angkatan</label>
            <Select value={angkatan} onValueChange={onSelectChange(setAngkatan)}>
              <SelectTrigger className="bg-[#f8f9fa] rounded-lg h-11 border-gray-200 text-[14px] w-full">
                <SelectValue placeholder="Semua Angkatan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semua">Semua Angkatan</SelectItem>
                {[...yearOptions, currentYear-6].map(a => <SelectItem key={a} value={a.toString()}>{a}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-[12px] font-medium text-gray-400">Program Studi</label>
            <Select value={programStudi} onValueChange={onSelectChange(setProgramStudi)}>
              <SelectTrigger className="bg-[#f8f9fa] rounded-lg h-11 border-gray-200 text-[14px] w-full">
                <SelectValue placeholder="Semua Program Studi">
                  {programStudi === 'Semua' ? 'Semua Program Studi' : programStudiList.find(p => p.id === programStudi)?.nama || programStudi}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semua">Semua Program Studi</SelectItem>
                {programStudiList.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.nama}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-gray-900">Data Prestasi Valid</h2>
          <span className="text-[13px] text-gray-400">Menampilkan {filteredData.length} dari {allData.length} data</span>
        </div>

        <div className="hidden md:block overflow-x-auto relative">
          {loading && <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center"><Loader2 className="animate-spin text-[#50c878]" /></div>}
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                {['No','Tahun','Semester','Nama Kegiatan','Jenis Lomba','Penyelenggara','Mahasiswa (NIM)','Angkatan','Program Studi','Kategori', 'Level', 'Aksi'].map(h => (
                  <th key={h} className="text-left py-4 px-4 text-[13px] font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-4 text-[13px] text-gray-400">{i + 1}</td>
                  <td className="py-4 px-4 text-[14px] font-medium text-gray-900">{row.tahun}</td>
                  <td className="py-4 px-4 text-[14px] text-gray-700">{row.semester}</td>
                  <td className="py-4 px-4 text-[14px] text-gray-900 max-w-[200px] truncate">{row.namaPrestasi}</td>
                  <td className="py-4 px-4 text-[13px] text-gray-700"><span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-[12px] font-medium border border-gray-200">{row.jenisLomba}</span></td>
                  <td className="py-4 px-4 text-[13px] text-gray-600 truncate max-w-[150px]">{row.namaPenyelenggara}</td>
                  <td className="py-4 px-4 text-[14px]">
                    <p className="font-medium text-gray-800 truncate max-w-[150px]">{row.mahasiswa?.user?.name || "Mahasiswa"}</p>
                    <p className="text-gray-400 text-[12px]">({row.mahasiswa?.nim})</p>
                  </td>
                  <td className="py-4 px-4 text-[14px] text-gray-700">{row.angkatan}</td>
                  <td className="py-4 px-4 text-[14px] text-gray-700">{row.programStudi?.nama}</td>
                  <td className="py-4 px-4 text-[14px] text-gray-700">{row.kategori?.nama}</td>
                  <td className="py-4 px-4">
                    <span className={`text-[12px] font-semibold px-3 py-1 rounded-full border ${
                      row.tingkat?.nama.toLowerCase().includes('internasional') ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      row.tingkat?.nama.toLowerCase().includes('nasional') ? 'bg-[#eafaf1] text-[#50c878] border-[#50c878]/20' :
                      'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {row.tingkat?.nama}
                    </span>
                  </td>
                  <td className="py-4 px-4"><button className="text-[#50c878] hover:text-[#006400] text-[14px] font-medium flex items-center gap-1 transition-colors"><ExternalLink className="h-4 w-4" />Lihat</button></td>
                </tr>
              ))}
              {filteredData.length === 0 && !loading && (
                <tr><td colSpan={11} className="py-12 text-center text-gray-400 text-[14px]">Tidak ada data sesuai filter</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden flex flex-col divide-y divide-gray-100 relative">
          {loading && <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center"><Loader2 className="animate-spin text-[#50c878]" /></div>}
          {filteredData.map((row, i) => (
            <div key={i} className="p-5 space-y-2">
              <div className="flex flex-wrap items-start gap-2 justify-between">
                <span className="text-[14px] font-semibold text-gray-900 flex-1">{row.namaPrestasi}</span>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-600`}>{row.kategori?.nama}</span>
              </div>
              <p className="text-[13px] text-gray-500">{row.mahasiswa?.nim}</p>
              <div className="flex gap-3 text-[12px] text-gray-400">
                <span>{row.tahun} {row.semester}</span><span>·</span><span className="truncate max-w-[150px]">{row.namaPenyelenggara}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Prestasi', value: filteredData.length },
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
                { mode: 'all' as const, title: `Semua Data (${allData.length} prestasi)`, desc: 'Export seluruh data' },
                { mode: 'filtered' as const, title: `Data Terfilter (${filteredData.length} prestasi)`, desc: 'Export hanya data yang ditampilkan' },
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
