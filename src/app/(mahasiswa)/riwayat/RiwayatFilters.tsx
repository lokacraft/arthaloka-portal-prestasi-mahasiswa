"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useTransition } from "react";

interface RiwayatFiltersProps {
  availableYears: number[];
  currentTahun?: number;
  currentStatus?: string;
  currentSearch: string;
  currentPerPage: number;
}

export function RiwayatFilters({ availableYears, currentTahun, currentStatus, currentSearch, currentPerPage }: RiwayatFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  function navigate(overrides: Record<string, string | number | null | undefined>) {
    const p = new URLSearchParams(searchParams.toString());
    p.set("page", "1");
    Object.entries(overrides).forEach(([k, v]) => {
      if (v !== undefined && v !== "" && v !== "all") p.set(k, String(v));
      else p.delete(k);
    });
    startTransition(() => router.push(`/riwayat?${p.toString()}`));
  }

  return (
    <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row gap-3 items-stretch md:items-center">
      {/* Search */}
      <form
        className="flex-1 relative min-w-[180px]"
        onSubmit={(e) => {
          e.preventDefault();
          const val = (e.currentTarget.elements.namedItem("search") as HTMLInputElement).value;
          navigate({ search: val });
        }}
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          name="search"
          defaultValue={currentSearch}
          placeholder="Cari nama kegiatan..."
          className="w-full bg-[#f8f9fa] text-[14px] rounded-lg pl-10 pr-4 py-2.5 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#50c878]/50"
        />
      </form>

      {/* Tahun */}
      <div className="w-full md:w-40">
        <Select value={currentTahun?.toString() ?? "all"} onValueChange={(v) => navigate({ tahun: v === "all" ? undefined : Number(v) })}>
          <SelectTrigger className="w-full bg-[#f8f9fa] border-gray-200 text-[14px]">
            <SelectValue placeholder="Semua Tahun" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tahun</SelectItem>
            {availableYears.map((y) => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Status */}
      <div className="w-full md:w-40">
        <Select value={currentStatus || "all"} onValueChange={(v) => navigate({ status: v === "all" ? undefined : v })}>
          <SelectTrigger className="w-full bg-[#f8f9fa] border-gray-200 text-[14px]">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Valid</SelectItem>
            <SelectItem value="REJECTED">Ditolak</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
