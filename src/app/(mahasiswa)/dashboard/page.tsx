export const dynamic = 'force-dynamic';

import React from "react";
import Link from "next/link";
import { Plus, Clock, CheckCircle2, XCircle, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/server/user-actions";
import { getPrestasiStats, getRecentPrestasi } from "@/server/prestasi-actions";
import { redirect } from "next/navigation";
import { Empty, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

function StatusBadge({ status }: { status: "PENDING" | "APPROVED" | "REJECTED" }) {
  const map = {
    PENDING: "bg-amber-50 text-amber-600 border-amber-100/50",
    APPROVED: "bg-[#eafaf1] text-[#50c878] border-[#50c878]/20",
    REJECTED: "bg-red-50 text-red-600 border-red-100/50",
  };
  const label = { PENDING: "Pending", APPROVED: "Valid", REJECTED: "Ditolak" };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${map[status]}`}>
      {label[status]}
    </span>
  );
}

export default async function DashboardMahasiswa({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; per_page?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const perPage = Number(params.per_page ?? 10);

  const [stats, recentResult] = await Promise.all([
    getPrestasiStats(user.mahasiswaId),
    getRecentPrestasi(user.mahasiswaId, page, perPage),
  ]);

  const { data: prestasi, total, totalPages } = recentResult;

  return (
    <div className="flex flex-col gap-8 pb-8 font-sans animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#1a1a1a] tracking-tight">Dashboard</h1>
          <p className="text-gray-500 text-[15px] mt-1">Selamat datang, {user.name}!</p>
        </div>
        <Link href="/lapor">
          <Button className="bg-[#006400] hover:bg-[#004d00] text-white rounded-xl h-11 px-5 shadow-sm flex items-center gap-2 transition-all">
            <Plus className="h-5 w-5" />
            <span className="font-medium text-[15px]">Laporkan Prestasi</span>
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between">
          <div>
            <p className="text-gray-500 font-medium text-[14px] mb-1">Pending</p>
            <h3 className="text-4xl font-semibold text-[#1a1a1a]">{stats.pending}</h3>
          </div>
          <div className="h-14 w-14 rounded-xl bg-amber-50 flex items-center justify-center">
            <Clock className="h-6 w-6 text-amber-500" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between">
          <div>
            <p className="text-gray-500 font-medium text-[14px] mb-1">Valid</p>
            <h3 className="text-4xl font-semibold text-[#1a1a1a]">{stats.approved}</h3>
          </div>
          <div className="h-14 w-14 rounded-xl bg-[#eafaf1] flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-[#50c878]" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between">
          <div>
            <p className="text-gray-500 font-medium text-[14px] mb-1">Ditolak</p>
            <h3 className="text-4xl font-semibold text-[#1a1a1a]">{stats.rejected}</h3>
          </div>
          <div className="h-14 w-14 rounded-xl bg-red-50 flex items-center justify-center">
            <XCircle className="h-6 w-6 text-red-500" />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-[18px] font-bold text-[#1a1a1a]">Pengajuan Terakhir</h2>
          {total > 0 && (
            <span className="text-[13px] text-gray-500">{total} pengajuan</span>
          )}
        </div>

        {prestasi.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <Empty>
              <EmptyTitle>Belum Ada Pengajuan</EmptyTitle>
              <EmptyDescription>
                Anda belum pernah melaporkan prestasi. Mulai dengan klik tombol di bawah.
              </EmptyDescription>
              <Link href="/lapor">
                <Button className="mt-4 bg-[#006400] hover:bg-[#004d00] text-white rounded-xl h-11 px-6 font-medium">
                  <Plus className="h-4 w-4 mr-2" />
                  Laporkan Prestasi
                </Button>
              </Link>
            </Empty>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-[14px] text-[#1a1a1a] font-semibold">
                    <th className="p-4 pl-6 whitespace-nowrap">Nama Kegiatan</th>
                    <th className="p-4 whitespace-nowrap">Kategori</th>
                    <th className="p-4 whitespace-nowrap">Level</th>
                    <th className="p-4 whitespace-nowrap">Status</th>
                    <th className="p-4 whitespace-nowrap">Tanggal</th>
                    <th className="p-4 pr-6 whitespace-nowrap">Detail</th>
                  </tr>
                </thead>
                <tbody className="text-[15px] text-gray-600 divide-y divide-gray-50">
                  {prestasi.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 pl-6 text-gray-800 max-w-[240px] truncate">{p.namaPrestasi}</td>
                      <td className="p-4">{p.kategori.nama}</td>
                      <td className="p-4">{p.tingkat.nama}</td>
                      <td className="p-4">
                        <StatusBadge status={p.statusValidasi} />
                      </td>
                      <td className="p-4 pr-6 text-gray-500 whitespace-nowrap">
                        {new Date(p.tanggalPelaksanaan).toLocaleDateString("id-ID", { dateStyle: "medium" })}
                      </td>
                      <td className="p-4 pr-6">
                        <Link href={`/detail/${p.id}`} className="text-[#50c878] hover:text-[#006400] font-medium text-[14px] transition-colors">
                          Lihat
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[13px] text-gray-500">
                Menampilkan {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} dari {total} pengajuan
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[13px] text-gray-500 mr-2">Per halaman:</span>
                {[5, 10, 15, 25, 50].map((n) => (
                  <Link
                    key={n}
                    href={`?page=1&per_page=${n}`}
                    className={`px-2.5 py-1 rounded-lg text-[13px] font-medium transition-colors ${
                      perPage === n
                        ? "bg-[#006400] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {n}
                  </Link>
                ))}
                <div className="ml-3 flex gap-1">
                  {page > 1 && (
                    <Link href={`?page=${page - 1}&per_page=${perPage}`} className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 text-[13px]">
                      ‹
                    </Link>
                  )}
                  {page < totalPages && (
                    <Link href={`?page=${page + 1}&per_page=${perPage}`} className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 text-[13px]">
                      ›
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
