import React, { Suspense } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/user-actions";
import { getAllPrestasiByMahasiswa, getPrestasiYears } from "@/server/prestasi-actions";
import { Empty, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { RiwayatFilters } from "./RiwayatFilters";

type Status = "PENDING" | "APPROVED" | "REJECTED";

function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, string> = {
    PENDING: "bg-amber-50 text-amber-600 border-amber-100/50",
    APPROVED: "bg-[#eafaf1] text-[#50c878] border-[#50c878]/20",
    REJECTED: "bg-red-50 text-red-600 border-red-100/50",
  };
  const label: Record<Status, string> = { PENDING: "Pending", APPROVED: "Valid", REJECTED: "Ditolak" };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${map[status]}`}>
      {label[status]}
    </span>
  );
}

export default async function RiwayatPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; per_page?: string; search?: string; tahun?: string; status?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const perPage = Number(params.per_page ?? 10);
  const search = params.search ?? "";
  const tahun = params.tahun ? Number(params.tahun) : undefined;
  const status = (params.status as Status) || undefined;

  const [result, availableYears] = await Promise.all([
    getAllPrestasiByMahasiswa(user.mahasiswaId, { page, perPage, search, tahun, status }),
    getPrestasiYears(user.mahasiswaId),
  ]);

  const { data: prestasi, total, totalPages } = result;

  function buildUrl(overrides: Record<string, string | number | undefined>) {
    const p = new URLSearchParams();
    const merged: Record<string, string | number | undefined> = { page, per_page: perPage, search, tahun, status, ...overrides };
    Object.entries(merged).forEach(([k, v]) => { if (v !== undefined && v !== "") p.set(k, String(v)); });
    return `/riwayat?${p.toString()}`;
  }

  return (
    <div className="flex flex-col gap-6 pb-8 font-sans animate-in fade-in duration-500">
      <div>
        <h1 className="text-[28px] font-bold text-[#1a1a1a] tracking-tight">Riwayat Pengajuan</h1>
        <p className="text-gray-500 text-[15px] mt-1">Lihat semua prestasi yang pernah Anda laporkan</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] overflow-hidden">
        <Suspense fallback={<div className="p-5 border-b border-gray-100 h-[72px]" />}>
          <RiwayatFilters
            availableYears={availableYears}
            currentTahun={tahun}
            currentStatus={status}
            currentSearch={search}
            currentPerPage={perPage}
          />
        </Suspense>

        {prestasi.length === 0 ? (
          <div className="py-16 flex items-center justify-center">
            <Empty>
              <EmptyTitle>Tidak Ada Data</EmptyTitle>
              <EmptyDescription>
                {search || tahun || status ? "Tidak ada data yang cocok dengan filter." : "Belum ada pengajuan prestasi."}
              </EmptyDescription>
            </Empty>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-[14px] text-[#1a1a1a] font-semibold">
                  <th className="p-4 pl-6 whitespace-nowrap">Tahun</th>
                  <th className="p-4 whitespace-nowrap min-w-[200px]">Nama Kegiatan</th>
                  <th className="p-4 whitespace-nowrap">Kategori</th>
                  <th className="p-4 whitespace-nowrap">Tingkat</th>
                  <th className="p-4 whitespace-nowrap">Status</th>
                  <th className="p-4 whitespace-nowrap">Tanggal Submit</th>
                  <th className="p-4 pr-6 whitespace-nowrap">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-[15px] text-gray-600 divide-y divide-gray-50">
                {prestasi.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 pl-6 text-gray-800">{row.tahun}</td>
                    <td className="p-4 max-w-[240px]"><span className="block truncate">{row.namaPrestasi}</span></td>
                    <td className="p-4">{row.kategori.nama}</td>
                    <td className="p-4">{row.tingkat.nama}</td>
                    <td className="p-4"><StatusBadge status={row.statusValidasi} /></td>
                    <td className="p-4 text-gray-500 whitespace-nowrap">
                      {new Date(row.createdAt).toLocaleDateString("id-ID", { dateStyle: "medium" })}
                    </td>
                    <td className="p-4 pr-6">
                      <Link href={`/detail/${row.id}`} className="inline-flex items-center gap-1.5 text-[#50c878] hover:text-[#006400] font-medium text-[14px] transition-colors whitespace-nowrap">
                        <Eye className="h-4 w-4" /> Lihat Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {prestasi.length > 0 && (
          <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[13px] text-gray-500">
              Menampilkan {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} dari {total} pengajuan
            </span>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <span className="text-[13px] text-gray-500">Per halaman:</span>
              {[5, 10, 15, 25, 50].map((n) => (
                <Link key={n} href={buildUrl({ per_page: n, page: 1 })}
                  className={`px-2.5 py-1 rounded-lg text-[13px] font-medium transition-colors ${perPage === n ? "bg-[#006400] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  {n}
                </Link>
              ))}
              <div className="ml-2 flex gap-1">
                {page > 1 && <Link href={buildUrl({ page: page - 1 })} className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 text-[13px]">‹</Link>}
                <span className="px-3 py-1 text-[13px] text-gray-600">{page}/{totalPages}</span>
                {page < totalPages && <Link href={buildUrl({ page: page + 1 })} className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 text-[13px]">›</Link>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
