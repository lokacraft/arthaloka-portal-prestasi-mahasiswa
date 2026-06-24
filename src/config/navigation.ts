import {
  Home,
  FileText,
  History,
  ClipboardCheck,
  Calculator,
  BarChart3,
  Users,
  Settings,
  Bell,
  LogOut,
  LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  subItems?: { title: string; url: string }[];
};

export const navigationConfig: Record<string, NavItem[]> = {
  mahasiswa: [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Laporkan Prestasi", url: "/lapor", icon: FileText },
    { title: "Riwayat Pengajuan", url: "/riwayat", icon: History },
  ],
  admin: [
    { title: "Dashboard Admin", url: "/admin/dashboard", icon: Home },
    {
      title: "Antrean Verifikasi",
      url: "/admin/verifikasi",
      icon: ClipboardCheck,
    },
    {
      title: "Kelola Akreditasi",
      url: "#",
      icon: BarChart3,
      subItems: [
        { title: "Kelola NM(TS)", url: "/admin/nmts" },
        { title: "Indikator Akreditasi", url: "/admin/indikator" },
      ],
    },
  ],
  akreditasi: [
    {
      title: "Dashboard Akreditasi",
      url: "/akreditasi/dashboard",
      icon: BarChart3,
    },
    { title: "Rekap 5 Tahun", url: "/akreditasi/rekap", icon: FileText },
  ],
  wd1: [{ title: "Dashboard Executive", url: "/wd1/dashboard", icon: Home }],
  kaprodi: [
    { title: "Dashboard Executive", url: "/kaprodi/dashboard", icon: Home },
  ],
};
