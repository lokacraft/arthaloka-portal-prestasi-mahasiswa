export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, Award, Users, FileText, MapPin, Calendar } from 'lucide-react';
import { getPrestasiDetail } from '@/server/akreditasi-actions';

export default async function AkreditasiDetailPrestasiPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prestasi = await getPrestasiDetail(id);

  if (!prestasi) notFound();

  const anggotaTim: { nim: string; nama: string; angkatan?: number }[] =
    Array.isArray(prestasi.anggotaTim) ? (prestasi.anggotaTim as any[]) : [];

  const sertifikatUrls: string[] = Array.isArray(prestasi.sertifikatUrls)
    ? (prestasi.sertifikatUrls as string[])
    : [];
  const buktiBuktiUrls: string[] = Array.isArray(prestasi.buktiBuktiUrls)
    ? (prestasi.buktiBuktiUrls as string[])
    : [];

  const allDocs = [...sertifikatUrls, ...buktiBuktiUrls];

  const formatDate = (d: Date | null) =>
    d
      ? new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
      : '-';

  return (
    <div className="flex flex-col gap-6 pb-10 font-sans animate-in fade-in duration-500">
      {/* Back Button */}
      <div>
        <Link
          href="/akreditasi/rekap"
          className="inline-flex items-center gap-2 text-[14px] text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Kembali ke Rekap 5 Tahun
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-2xl bg-[#eafaf1] text-[#50c878] flex items-center justify-center flex-shrink-0">
          <Award className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-[22px] font-bold text-gray-900 tracking-tight leading-snug">
            {prestasi.namaPrestasi}
          </h1>
          <p className="text-[14px] text-gray-500 mt-0.5">
            {prestasi.namaPenyelenggara} · {prestasi.tahun}
          </p>
        </div>
      </div>

      {/* Status & Tingkat Badges */}
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold bg-[#eafaf1] text-[#22c55e]">
          ✓ Valid
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold bg-indigo-50 text-indigo-600">
          {prestasi.tingkat?.nama}
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold bg-amber-50 text-amber-600">
          {prestasi.kategori?.nama}
        </span>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold ${
          prestasi.tipePartisipasi === 'TIM'
            ? 'bg-purple-50 text-purple-600'
            : 'bg-gray-100 text-gray-600'
        }`}>
          {prestasi.tipePartisipasi === 'TIM' ? '👥 Tim' : '👤 Individu'}
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold bg-blue-50 text-blue-600">
          {prestasi.jenisLomba === 'BELMAWA' ? 'Belmawa' : 'Mandiri'}
        </span>
        {prestasi.programStudi && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold bg-gray-100 text-gray-600">
            {prestasi.programStudi.nama}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Info Mahasiswa + Prestasi */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          {/* Info Mahasiswa */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6">
            <h2 className="text-[15px] font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="h-4 w-4 text-[#50c878]" />Informasi Mahasiswa
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Nama', value: prestasi.mahasiswa?.user?.name ?? '-' },
                { label: 'NIM', value: prestasi.mahasiswa?.nim ?? '-' },
                { label: 'Angkatan', value: prestasi.angkatan?.toString() ?? '-' },
                { label: 'Program Studi', value: prestasi.programStudi?.nama ?? prestasi.mahasiswa?.programStudi?.nama ?? '-' },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-[12px] text-gray-400 mb-0.5">{item.label}</p>
                  <p className="text-[14px] font-medium text-gray-800">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Detail Prestasi */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6">
            <h2 className="text-[15px] font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="h-4 w-4 text-[#50c878]" />Detail Prestasi
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Hasil / Juara', value: prestasi.hasilCapaian },
                { label: 'Poin', value: prestasi.poin?.toString() ?? '0' },
                { label: 'Penyelenggara', value: prestasi.namaPenyelenggara },
                { label: 'Semester', value: prestasi.semester },
                { label: 'Keterangan', value: prestasi.keterangan || '-' },
              ].map((item) => (
                <div key={item.label} className={item.label === 'Keterangan' ? 'col-span-2' : ''}>
                  <p className="text-[12px] text-gray-400 mb-0.5">{item.label}</p>
                  <p className="text-[14px] font-medium text-gray-800">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Anggota Tim */}
          {prestasi.tipePartisipasi === 'TIM' && anggotaTim.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6">
              <h2 className="text-[15px] font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-500" />Anggota Tim
              </h2>
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-4 py-2.5 text-left font-semibold text-gray-600">No</th>
                      <th className="px-4 py-2.5 text-left font-semibold text-gray-600">NIM</th>
                      <th className="px-4 py-2.5 text-left font-semibold text-gray-600">Nama</th>
                      <th className="px-4 py-2.5 text-left font-semibold text-gray-600">Angkatan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {anggotaTim.map((a, idx) => (
                      <tr key={idx} className="border-b border-gray-50 last:border-0">
                        <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                        <td className="px-4 py-3 font-mono text-[12px] text-gray-600">{a.nim}</td>
                        <td className="px-4 py-3 text-gray-800">{a.nama}</td>
                        <td className="px-4 py-3 text-gray-600">{a.angkatan ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Bukti / Dokumen */}
          {allDocs.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6">
              <h2 className="text-[15px] font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#50c878]" />Dokumen Bukti ({allDocs.length} file)
              </h2>
              <div className="flex flex-col gap-2">
                {allDocs.map((url, idx) => {
                  const filename = url.split('/').pop() ?? `Dokumen ${idx + 1}`;
                  return (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-[#50c878]/40 hover:bg-[#eafaf1]/40 transition-colors"
                    >
                      <div className="h-8 w-8 rounded-lg bg-[#eafaf1] flex items-center justify-center flex-shrink-0">
                        <FileText className="h-4 w-4 text-[#50c878]" />
                      </div>
                      <span className="text-[13px] text-gray-700 truncate">{filename}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Kolom Kanan: Waktu & Lokasi */}
        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6">
            <h2 className="text-[15px] font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#50c878]" />Waktu Kegiatan
            </h2>
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-[12px] text-gray-400 mb-0.5">Tanggal Mulai</p>
                <p className="text-[14px] font-medium text-gray-800">{formatDate(prestasi.tanggalMulai)}</p>
              </div>
              <div>
                <p className="text-[12px] text-gray-400 mb-0.5">Tanggal Selesai</p>
                <p className="text-[14px] font-medium text-gray-800">{formatDate(prestasi.tanggalSelesai)}</p>
              </div>
              <div>
                <p className="text-[12px] text-gray-400 mb-0.5">Tahun & Semester</p>
                <p className="text-[14px] font-medium text-gray-800">
                  {prestasi.tahun} · {prestasi.semester === 'GANJIL' ? 'Semester Ganjil' : 'Semester Genap'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6">
            <h2 className="text-[15px] font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#50c878]" />Lokasi Kegiatan
            </h2>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Provinsi', value: prestasi.provinsi || '-' },
                { label: 'Kota', value: prestasi.kota || '-' },
                { label: 'Tempat', value: prestasi.namaLokasi || '-' },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-[12px] text-gray-400 mb-0.5">{item.label}</p>
                  <p className="text-[14px] font-medium text-gray-800">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {prestasi.validator && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6">
              <h2 className="text-[15px] font-semibold text-gray-900 mb-3">Info Validasi</h2>
              <div>
                <p className="text-[12px] text-gray-400 mb-0.5">Divalidasi oleh</p>
                <p className="text-[14px] font-medium text-gray-800">{prestasi.validator.name}</p>
              </div>
              {prestasi.tanggalValidasi && (
                <div className="mt-3">
                  <p className="text-[12px] text-gray-400 mb-0.5">Tanggal Validasi</p>
                  <p className="text-[14px] font-medium text-gray-800">{formatDate(prestasi.tanggalValidasi)}</p>
                </div>
              )}
              {prestasi.catatanValidasi && (
                <div className="mt-3">
                  <p className="text-[12px] text-gray-400 mb-0.5">Catatan</p>
                  <p className="text-[13px] text-gray-700">{prestasi.catatanValidasi}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
