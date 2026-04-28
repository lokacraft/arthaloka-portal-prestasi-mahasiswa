"use client";

import React, { useState, useEffect } from 'react';
import { Users, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getNmTs, upsertNmTs } from '@/server/akreditasi-actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type NmTsData = {
  id: string;
  tahun: number;
  jumlahMahasiswa: number;
  updatedAt: Date;
};

export default function KelolaNmtsPage() {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const [tahun, setTahun] = useState(currentYear.toString());
  const [jumlah, setJumlah] = useState('');
  const [riwayat, setRiwayat] = useState<NmTsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRiwayat();
  }, []);

  const fetchRiwayat = async () => {
    try {
      setLoading(true);
      const data = await getNmTs();
      // @ts-ignore
      setRiwayat(data);
    } catch (error) {
      console.error(error);
      alert("Gagal memuat data NMTS");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!tahun || !jumlah) return;
    try {
      setSaving(true);
      const res = await upsertNmTs(parseInt(tahun), parseInt(jumlah));
      if (res.success) {
        setJumlah('');
        await fetchRiwayat();
      } else {
        alert(res.error);
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menyimpan");
    } finally {
      setSaving(false);
    }
  };

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
            <Select value={tahun} onValueChange={(val) => val && setTahun(val)}>
              <SelectTrigger className="w-full bg-[#f8f9fa] text-gray-800 text-[15px] rounded-xl h-[46px] border-gray-200">
                <SelectValue placeholder="Pilih Tahun" />
              </SelectTrigger>
              <SelectContent>
                {years.map(y => (
                  <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-[14px] font-semibold text-[#1a1a1a]">Jumlah Mahasiswa Aktif</label>
            <input type="number" value={jumlah} onChange={e => setJumlah(e.target.value)} placeholder="450" className="w-full bg-[#f8f9fa] text-gray-800 placeholder-gray-400 text-[15px] rounded-xl px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#50c878]/50" />
          </div>
        </div>
        <Button onClick={handleSave} disabled={!tahun || !jumlah || saving} className="w-full bg-[#006400] hover:bg-[#004d00] text-white disabled:bg-gray-200 disabled:text-gray-400 rounded-xl h-12 text-[15px] font-semibold flex gap-2 items-center justify-center">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          Simpan Nilai NM(TS)
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-100"><h2 className="text-[18px] font-semibold text-[#1a1a1a]">Riwayat NM(TS)</h2></div>
        {loading ? (
          <div className="p-8 text-center text-gray-500 flex justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div>
        ) : riwayat.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Belum ada data NM(TS).</div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    {['Tahun','Jumlah Mahasiswa','Terakhir Diperbarui'].map(h => <th key={h} className="text-left py-4 px-6 text-[14px] font-semibold text-gray-500">{h}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {riwayat.map(r => (
                    <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 text-[15px] font-medium text-gray-900">{r.tahun}</td>
                      <td className="py-4 px-6 text-[15px] text-gray-700">{r.jumlahMahasiswa}</td>
                      <td className="py-4 px-6 text-[14px] text-gray-400">{new Date(r.updatedAt).toLocaleDateString('id-ID')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden flex flex-col divide-y divide-gray-100">
              {riwayat.map(r => (
                <div key={r.id} className="p-5 flex flex-col gap-2">
                  <div className="flex justify-between"><span className="text-[16px] font-semibold text-gray-900">{r.tahun}</span><span className="text-[15px] text-gray-700 font-medium">{r.jumlahMahasiswa} mhs</span></div>
                  <span className="text-[13px] text-gray-400">Diperbarui: {new Date(r.updatedAt).toLocaleDateString('id-ID')}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
