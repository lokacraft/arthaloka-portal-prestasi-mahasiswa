export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import { Users, ChevronLeft, ChevronRight } from 'lucide-react';
import prisma from "@/lib/prisma";
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Button } from '@/components/ui/button';

interface PageProps {
  searchParams: Promise<{ page?: string; limit?: string }>;
}

export default async function AntreanVerifikasiPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const skip = (page - 1) * limit;

  // 1. Fetch Data
  const [pengajuanRaw, totalPending] = await Promise.all([
    prisma.prestasi.findMany({
      where: { statusValidasi: 'PENDING' },
      include: {
        mahasiswa: {
          include: {
            user: true
          }
        },
        kategori: true,
        tingkat: true
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.prestasi.count({ where: { statusValidasi: 'PENDING' } })
  ]);

  const totalPages = Math.ceil(totalPending / limit);

  return (
    <div className="flex flex-col gap-6 pb-8 font-sans animate-in fade-in duration-500">
      <div>
        <h1 className="text-[28px] font-bold text-[#1a1a1a] tracking-tight">Antrean Verifikasi</h1>
        <p className="text-gray-500 text-[15px] mt-1">Klik pengajuan untuk melihat detail dan melakukan verifikasi</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
          <h2 className="text-[18px] font-semibold text-[#1a1a1a]">Pengajuan Pending</h2>
          <span className="bg-amber-50 text-amber-600 border border-amber-100 text-[13px] font-semibold px-4 py-1.5 rounded-full">
            {totalPending} Menunggu Verifikasi
          </span>
        </div>
        <div className="flex flex-col divide-y divide-gray-100">
          {pengajuanRaw.length > 0 ? (
            pengajuanRaw.map((p) => (
              <Link key={p.id} href={`/admin/verifikasi/${p.id}`} className="p-6 hover:bg-gray-50/60 transition-colors block group">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-[16px] font-semibold text-gray-900 group-hover:text-[#50c878] transition-colors">{p.namaPrestasi}</h3>
                      {p.tipePartisipasi === 'TIM' && (
                        <span className="bg-[#eafaf1] text-[#50c878] px-3 py-1 rounded-full text-[12px] font-semibold flex items-center gap-1.5 border border-[#50c878]/20">
                          <Users className="h-3.5 w-3.5" />Tim
                        </span>
                      )}
                    </div>
                    <p className="text-[14px] text-gray-500 mt-1">{p.mahasiswa.user.name} ({p.mahasiswa.nim}) • Angkatan {p.angkatan || '-'}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {p.jenisLomba && (
                        <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-[13px] font-medium border border-orange-100/50">
                          {p.jenisLomba}
                        </span>
                      )}
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[13px] font-medium">{p.kategori.nama}</span>
                      <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-[13px] font-medium">{p.tingkat.nama}</span>
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[13px] font-medium">{p.tahun} - Semester {p.semester}</span>
                    </div>
                  </div>
                  <span className="text-[13px] text-gray-400 font-medium">
                    {format(p.createdAt, 'd MMM yyyy', { locale: id })}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="p-12 text-center text-gray-500 text-[14px]">
              Tidak ada pengajuan yang menunggu verifikasi saat ini.
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-gray-100 flex items-center justify-between">
            <p className="text-[13px] text-gray-500">
              Menampilkan {skip + 1} - {Math.min(skip + limit, totalPending)} dari {totalPending} pengajuan
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                render={page > 1 ? <Link href={`/admin/verifikasi?page=${page - 1}&limit=${limit}`} /> : undefined}
                className="h-9 px-3 rounded-lg"
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Sebelumnya
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    variant={p === page ? "default" : "ghost"}
                    size="sm"
                    render={p !== page ? <Link href={`/admin/verifikasi?page=${p}&limit=${limit}`} /> : undefined}
                    className={`h-9 w-9 rounded-lg ${p === page ? "bg-[#50c878] hover:bg-[#43b569]" : ""}`}
                  >
                    {p}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                render={page < totalPages ? <Link href={`/admin/verifikasi?page=${page + 1}&limit=${limit}`} /> : undefined}
                className="h-9 px-3 rounded-lg"
              >
                Selanjutnya <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
