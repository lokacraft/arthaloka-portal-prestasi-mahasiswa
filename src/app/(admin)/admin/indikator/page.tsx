"use client";

import React, { useState, useEffect } from 'react';
import { Info, Settings, AlertTriangle, CheckCircle, XCircle, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getNmTs, getTargets, updateTarget, getRekapPrestasiAkreditasi, getDetailPrestasiExport, getKategoriPrestasi } from '@/server/akreditasi-actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import * as XLSX from 'xlsx';

export default function IndikatorPage() {
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  // ==========================================
  // STATE
  // ==========================================
  const [tahunSasaran, setTahunSasaran] = useState(currentYear.toString());
  const [rentangMode, setRentangMode] = useState<'5'>('5');
  const [tahunMulaiCustom, setTahunMulaiCustom] = useState((currentYear - 2).toString());
  
  const [kategoriList, setKategoriList] = useState<{id: string, nama: string}[]>([]);
  const [kategoriFilter, setKategoriFilter] = useState('Semua');
  
  const [loadingAuto, setLoadingAuto] = useState(false);
  const [nmtsVal, setNmtsVal] = useState<number | null>(null);
  const [targets, setTargets] = useState<{ RI: number, RN: number, RW: number }>({ RI: 0.2, RN: 2.0, RW: 4.0 });
  
  const [rekapAuto, setRekapAuto] = useState<{ NI: number, NN: number, NW: number }>({ NI: 0, NN: 0, NW: 0 });

  // Settings Danger Area
  const [showSettings, setShowSettings] = useState(false);
  const [editTargets, setEditTargets] = useState({ RI: "0.2", RN: "2.0", RW: "4.0" });
  const [savingTargets, setSavingTargets] = useState(false);

  // ==========================================
  // EFFECTS & FETCHERS
  // ==========================================
  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchAutoData();
  }, [tahunSasaran, rentangMode, tahunMulaiCustom, kategoriFilter]);

  const fetchInitialData = async () => {
    try {
      // 1. Fetch Targets
      const dbTargets = await getTargets();
      const newT = { RI: 0.2, RN: 2.0, RW: 4.0 };
      dbTargets.forEach(t => {
        if (t.kodeTarget === 'RI') newT.RI = t.nilaiPersen;
        if (t.kodeTarget === 'RN') newT.RN = t.nilaiPersen;
        if (t.kodeTarget === 'RW') newT.RW = t.nilaiPersen;
      });
      setTargets(newT);
      setEditTargets({ RI: newT.RI.toString(), RN: newT.RN.toString(), RW: newT.RW.toString() });

      // 2. Fetch Kategori
      const kats = await getKategoriPrestasi();
      setKategoriList(kats);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAutoData = async () => {
    try {
      setLoadingAuto(true);
      const ts = parseInt(tahunSasaran);
      
      // 1. Fetch NMTS
      const nmtsDoc = await getNmTs(ts);
      // @ts-ignore
      setNmtsVal(nmtsDoc ? nmtsDoc.jumlahMahasiswa : null);

      // 2. Calculate Rentang
      const rentangValue = 5;

      // 3. Fetch Rekap Prestasi
      const res = await getRekapPrestasiAkreditasi(ts, rentangValue, kategoriFilter);
      setRekapAuto(res);
      
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAuto(false);
    }
  };

  const handleSaveTargets = async () => {
    if (!window.confirm("Apakah Anda yakin ingin mengubah ambang batas target? Ini akan mempengaruhi status seluruh laporan.")) return;
    try {
      setSavingTargets(true);
      await updateTarget("RI", parseFloat(editTargets.RI));
      await updateTarget("RN", parseFloat(editTargets.RN));
      await updateTarget("RW", parseFloat(editTargets.RW));
      await fetchInitialData();
      setShowSettings(false);
      alert("Target berhasil diperbarui!");
    } catch (error) {
      console.error(error);
      alert("Gagal mengupdate target");
    } finally {
      setSavingTargets(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      setLoadingAuto(true);
      const ts = parseInt(tahunSasaran);
      const rentangValue = 5;

      const data = await getDetailPrestasiExport(ts, rentangValue);
      
      let filtered = data;
      if (kategoriFilter !== 'Semua') {
        if (kategoriFilter === 'Akademik') {
          filtered = data.filter(d => d.kategori.nama.toLowerCase().includes('akademik'));
        } else if (kategoriFilter === 'Non-Akademik') {
          filtered = data.filter(d => !d.kategori.nama.toLowerCase().includes('akademik'));
        }
      }

      const exportData = filtered.map(d => ({
        "ID Prestasi": d.id,
        "Tahun": d.tahun,
        "Angkatan": d.angkatan || "N/A",
        "Nama Mahasiswa": d.mahasiswa?.nim || "N/A",
        "Nama Kegiatan": d.namaPrestasi,
        "Jenis Lomba": d.jenisLomba || "N/A",
        "Kategori": d.kategori?.nama || "N/A",
        "Tingkat": d.tingkat?.nama || "N/A",
        "Capaian": d.hasilCapaian || "N/A",
        "Tanggal Mulai": d.tanggalMulai ? new Date(d.tanggalMulai).toLocaleDateString("id-ID") : "N/A",
        "Tanggal Selesai": d.tanggalSelesai ? new Date(d.tanggalSelesai).toLocaleDateString("id-ID") : "N/A",
        "URL Sertifikat / Evidence": (d.sertifikatUrls as string[] | null)?.join(", ") || "Tidak Ada",
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Prestasi");
      
      const timestamp = new Date().getTime();
      XLSX.writeFile(wb, `Rekap_Prestasi_${tahunSasaran}_${timestamp}.xlsx`);
      
    } catch (error) {
      console.error(error);
      alert("Gagal export excel");
    } finally {
      setLoadingAuto(false);
    }
  };

  const rasioAuto = (val: number) => {
    if (!nmtsVal) return 0;
    return (val / nmtsVal) * 100;
  };
  
  const getStatus = (val: number, target: number) => {
    const r = rasioAuto(val);
    const tercapai = r >= target;
    const kurang = tercapai ? 0 : Math.ceil(((target / 100) * (nmtsVal || 0)) - val);
    return {
      tercapai,
      rasioStr: r.toFixed(2) + "%",
      kurang
    };
  };

  return (
    <div className="flex flex-col gap-6 pb-8 font-sans animate-in fade-in duration-500">
      <div>
        <h1 className="text-[28px] font-bold text-[#1a1a1a] tracking-tight">Indikator Akreditasi</h1>
        <p className="text-gray-500 text-[15px] mt-1">Pantau ketercapaian rasio prestasi berdasarkan standar LAM TEKNIK (Otomatis)</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[18px] font-semibold text-[#1a1a1a]">Filter Data</h2>
            <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)} className="text-orange-600 border-orange-200 hover:bg-orange-50">
              <Settings className="w-4 h-4 mr-2" /> Pengaturan Target
            </Button>
          </div>

          {showSettings && (
            <div className="bg-orange-50 border border-orange-200 p-5 rounded-xl mb-6">
              <div className="flex items-center gap-2 text-orange-800 font-semibold mb-4">
                <AlertTriangle className="w-5 h-5" /> Danger Area: Ubah Ambang Batas Target (%)
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-[13px] text-orange-700 font-medium">Target RI (%)</label>
                  <input type="number" step="0.1" value={editTargets.RI} onChange={e => setEditTargets(prev => ({...prev, RI: e.target.value}))} className="w-full mt-1 px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
                </div>
                <div>
                  <label className="text-[13px] text-orange-700 font-medium">Target RN (%)</label>
                  <input type="number" step="0.1" value={editTargets.RN} onChange={e => setEditTargets(prev => ({...prev, RN: e.target.value}))} className="w-full mt-1 px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
                </div>
                <div>
                  <label className="text-[13px] text-orange-700 font-medium">Target RW (%)</label>
                  <input type="number" step="0.1" value={editTargets.RW} onChange={e => setEditTargets(prev => ({...prev, RW: e.target.value}))} className="w-full mt-1 px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
                </div>
              </div>
              <Button onClick={handleSaveTargets} disabled={savingTargets} className="bg-orange-600 hover:bg-orange-700 text-white w-full h-11 font-semibold rounded-xl">
                {savingTargets ? "Menyimpan..." : "Simpan Perubahan Target"}
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#1a1a1a]">Tahun Sasaran (TS)</label>
              <Select value={tahunSasaran} onValueChange={(val) => val && setTahunSasaran(val)}>
                <SelectTrigger className="w-full bg-[#f8f9fa] text-gray-800 text-[15px] rounded-xl h-[46px] border-gray-200">
                  <SelectValue placeholder="Pilih Tahun" />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map(y => (
                    <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#1a1a1a]">Rentang Analisis</label>
              <Select value={rentangMode} onValueChange={(val: any) => val && setRentangMode(val)}>
                <SelectTrigger className="w-full bg-[#f8f9fa] text-gray-800 text-[15px] rounded-xl h-[46px] border-gray-200">
                  <SelectValue placeholder="Pilih Rentang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 Tahun Terakhir</SelectItem>
                </SelectContent>
              </Select>
            </div>



            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#1a1a1a]">Kategori Prestasi</label>
              <Select value={kategoriFilter} onValueChange={(val) => val && setKategoriFilter(val)}>
                <SelectTrigger className="w-full bg-[#f8f9fa] text-gray-800 text-[15px] rounded-xl h-[46px] border-gray-200">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Semua">Semua Kategori</SelectItem>
                  <SelectItem value="Akademik">Akademik</SelectItem>
                  <SelectItem value="Non-Akademik">Non-Akademik</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex gap-2 items-center">
              <span className="font-semibold text-gray-700">Jumlah Mahasiswa Aktif (NMTS):</span>
              {nmtsVal === null ? (
                <span className="text-red-500 font-medium bg-red-50 px-2 py-1 rounded-md text-sm">Belum Diisi! Rasio tidak dapat dihitung.</span>
              ) : (
                <span className="text-[#006400] font-bold bg-[#eafaf1] px-3 py-1 rounded-md">{nmtsVal} Mahasiswa</span>
              )}
            </div>
            
            <Button onClick={handleExportExcel} disabled={loadingAuto} variant="outline" className="mt-4 md:mt-0 flex items-center gap-2 border-[#50c878] text-[#006400] hover:bg-[#50c878]/10 h-11 px-6 rounded-xl">
              {loadingAuto ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Export Excel Detail
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="p-6 md:p-8 border-b border-gray-100">
            <h2 className="text-[18px] font-semibold text-[#1a1a1a]">Hasil Matriks LAM TEKNIK</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="text-left py-4 px-6 text-[14px] font-semibold text-gray-500">Indikator</th>
                  <th className="text-center py-4 px-6 text-[14px] font-semibold text-gray-500">Total Akumulasi</th>
                  <th className="text-center py-4 px-6 text-[14px] font-semibold text-gray-500">Rasio</th>
                  <th className="text-center py-4 px-6 text-[14px] font-semibold text-gray-500">Target</th>
                  <th className="text-left py-4 px-6 text-[14px] font-semibold text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 relative">
                {loadingAuto && (
                  <tr className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                    <td><Loader2 className="w-8 h-8 text-[#50c878] animate-spin" /></td>
                  </tr>
                )}
                
                {/* RI */}
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-[15px] font-medium text-gray-900">Prestasi Internasional (RI)</td>
                  <td className="py-4 px-6 text-[15px] text-center font-bold text-[#1a1a1a]">{rekapAuto.NI}</td>
                  <td className="py-4 px-6 text-[15px] text-center">{getStatus(rekapAuto.NI, targets.RI).rasioStr}</td>
                  <td className="py-4 px-6 text-[15px] text-center text-gray-500">&ge; {targets.RI}%</td>
                  <td className="py-4 px-6">
                    {nmtsVal === null ? <span className="text-gray-400">-</span> : getStatus(rekapAuto.NI, targets.RI).tercapai ? (
                      <div className="flex items-center gap-1.5 text-[#006400] font-medium bg-[#eafaf1] w-fit px-3 py-1 rounded-full text-[13px]">
                        <CheckCircle className="w-4 h-4" /> Tercapai
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-red-600 font-medium bg-red-50 w-fit px-3 py-1 rounded-full text-[13px]">
                          <XCircle className="w-4 h-4" /> Belum Tercapai
                        </div>
                        <span className="text-[12px] text-gray-500">Butuh {getStatus(rekapAuto.NI, targets.RI).kurang} prestasi lagi</span>
                      </div>
                    )}
                  </td>
                </tr>

                {/* RN */}
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-[15px] font-medium text-gray-900">Prestasi Nasional (RN)</td>
                  <td className="py-4 px-6 text-[15px] text-center font-bold text-[#1a1a1a]">{rekapAuto.NN}</td>
                  <td className="py-4 px-6 text-[15px] text-center">{getStatus(rekapAuto.NN, targets.RN).rasioStr}</td>
                  <td className="py-4 px-6 text-[15px] text-center text-gray-500">&ge; {targets.RN}%</td>
                  <td className="py-4 px-6">
                    {nmtsVal === null ? <span className="text-gray-400">-</span> : getStatus(rekapAuto.NN, targets.RN).tercapai ? (
                      <div className="flex items-center gap-1.5 text-[#006400] font-medium bg-[#eafaf1] w-fit px-3 py-1 rounded-full text-[13px]">
                        <CheckCircle className="w-4 h-4" /> Tercapai
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-red-600 font-medium bg-red-50 w-fit px-3 py-1 rounded-full text-[13px]">
                          <XCircle className="w-4 h-4" /> Belum Tercapai
                        </div>
                        <span className="text-[12px] text-gray-500">Butuh {getStatus(rekapAuto.NN, targets.RN).kurang} prestasi lagi</span>
                      </div>
                    )}
                  </td>
                </tr>

                {/* RW */}
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-[15px] font-medium text-gray-900">Prestasi Wilayah/Lokal (RW)</td>
                  <td className="py-4 px-6 text-[15px] text-center font-bold text-[#1a1a1a]">{rekapAuto.NW}</td>
                  <td className="py-4 px-6 text-[15px] text-center">{getStatus(rekapAuto.NW, targets.RW).rasioStr}</td>
                  <td className="py-4 px-6 text-[15px] text-center text-gray-500">&ge; {targets.RW}%</td>
                  <td className="py-4 px-6">
                    {nmtsVal === null ? <span className="text-gray-400">-</span> : getStatus(rekapAuto.NW, targets.RW).tercapai ? (
                      <div className="flex items-center gap-1.5 text-[#006400] font-medium bg-[#eafaf1] w-fit px-3 py-1 rounded-full text-[13px]">
                        <CheckCircle className="w-4 h-4" /> Tercapai
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-red-600 font-medium bg-red-50 w-fit px-3 py-1 rounded-full text-[13px]">
                          <XCircle className="w-4 h-4" /> Belum Tercapai
                        </div>
                        <span className="text-[12px] text-gray-500">Butuh {getStatus(rekapAuto.NW, targets.RW).kurang} prestasi lagi</span>
                      </div>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
