import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Trophy, Users, FileText, MessageSquare, CheckCircle2, Clock, XCircle, ExternalLink, User } from "lucide-react";
import { getCurrentUser } from "@/server/user-actions";
import { getPrestasiById } from "@/server/prestasi-actions";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import type { StatusValidasi } from "@/generated/prisma/client";

function StatusBadge({ status }: { status: StatusValidasi }) {
  const map = {
    PENDING: { label: "Pending", className: "bg-amber-50 text-amber-600 border-amber-200", icon: Clock },
    APPROVED: { label: "Valid / Disetujui", className: "bg-[#eafaf1] text-[#006400] border-[#50c878]/30", icon: CheckCircle2 },
    REJECTED: { label: "Ditolak", className: "bg-red-50 text-red-600 border-red-200", icon: XCircle },
  };
  const { label, className, icon: Icon } = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${className}`}>
      <Icon className="h-4 w-4" />{label}
    </span>
  );
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-3.5 border-b border-gray-50 last:border-0">
      <span className="text-[13px] font-semibold text-gray-500 sm:w-48 shrink-0">{label}</span>
      <span className="text-[15px] text-gray-800">{value}</span>
    </div>
  );
}

export default async function DetailPrestasiPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const prestasi = await getPrestasiById(id);
  if (!prestasi || prestasi.mahasiswaId !== user.mahasiswaId) notFound();

  const anggotaTim = prestasi.anggotaTim as { nim: string; nama: string }[] | null;
  const buktiBuktiUrls = prestasi.buktiBuktiUrls as string[] | null;
  const tempatLengkap = [prestasi.namaLokasi, prestasi.kota, prestasi.provinsi].filter(Boolean).join(", ");

  return (
    <div className="flex flex-col gap-6 pb-8 font-sans animate-in fade-in duration-500">
      <div>
        <Link href="/riwayat" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#006400] transition-colors text-[14px] font-medium">
          <ArrowLeft className="h-4 w-4" />Kembali ke Riwayat
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h1 className="text-[20px] font-bold text-[#1a1a1a] leading-snug">{prestasi.namaPrestasi}</h1>
              <p className="text-gray-500 text-[14px] mt-1">{prestasi.namaPenyelenggara}</p>
            </div>
            <StatusBadge status={prestasi.statusValidasi} />
          </div>
          <div className="px-6 pb-6">
            <DetailRow label="Kategori" value={prestasi.kategori.nama} />
            <DetailRow label="Tingkat / Level" value={prestasi.tingkat.nama} />
            <DetailRow label="Tahun Kegiatan" value={`${prestasi.tahun} — Semester ${prestasi.semester}`} />
            <DetailRow label="Hasil / Capaian" value={prestasi.hasilCapaian} />
            <DetailRow label="Tanggal Pelaksanaan" value={format(new Date(prestasi.tanggalPelaksanaan), "EEEE, d MMMM yyyy", { locale: localeId })} />
            <DetailRow label="Tempat Pelaksanaan" value={tempatLengkap || undefined} />
            <DetailRow label="Tipe Partisipasi" value={prestasi.tipePartisipasi === "INDIVIDU" ? "Individu" : "Regu / Tim"} />
            <DetailRow label="Keterangan" value={prestasi.keterangan ?? undefined} />
            <DetailRow label="Tanggal Pengajuan" value={format(new Date(prestasi.createdAt), "d MMMM yyyy, HH:mm", { locale: localeId })} />
          </div>
        </div>

        {/* Side Cards */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-5 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-[13px] font-medium">Poin Diperoleh</p>
              <p className="text-3xl font-bold text-[#006400] mt-0.5">{prestasi.poin}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-[#eafaf1] flex items-center justify-center">
              <Trophy className="h-6 w-6 text-[#50c878]" />
            </div>
          </div>

          {prestasi.sertifikatUrl && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-5">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-[14px] font-semibold text-[#1a1a1a]">Sertifikat</span>
              </div>
              <a href={prestasi.sertifikatUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[14px] text-[#50c878] hover:text-[#006400] font-medium transition-colors">
                <ExternalLink className="h-4 w-4" />Lihat Sertifikat
              </a>
            </div>
          )}

          {buktiBuktiUrls && buktiBuktiUrls.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-5">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-[14px] font-semibold text-[#1a1a1a]">Bukti Pendukung ({buktiBuktiUrls.length})</span>
              </div>
              <div className="space-y-2">
                {buktiBuktiUrls.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[13px] text-[#50c878] hover:text-[#006400] transition-colors">
                    <ExternalLink className="h-3.5 w-3.5" />Bukti {i + 1}
                  </a>
                ))}
              </div>
            </div>
          )}

          {anggotaTim && anggotaTim.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-5">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-[14px] font-semibold text-[#1a1a1a]">Anggota Tim</span>
              </div>
              <div className="space-y-2">
                {anggotaTim.map((m, i) => (
                  <div key={i} className="text-[13px]">
                    <span className="font-medium text-gray-800">{m.nama}</span>
                    <span className="text-gray-500 ml-2">({m.nim})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {prestasi.catatanValidasi && (
            <div className={`rounded-2xl border p-5 ${prestasi.statusValidasi === "REJECTED" ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"}`}>
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-gray-500" />
                <span className="text-[14px] font-semibold text-[#1a1a1a]">Catatan Validator</span>
              </div>
              <p className="text-[14px] text-gray-700 leading-relaxed">{prestasi.catatanValidasi}</p>
              {prestasi.validator && (
                <p className="text-[12px] text-gray-500 mt-2 flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  {prestasi.validator.name}
                  {prestasi.tanggalValidasi && ` · ${format(new Date(prestasi.tanggalValidasi), "d MMM yyyy", { locale: localeId })}`}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
