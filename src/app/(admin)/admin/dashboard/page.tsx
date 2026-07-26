export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import { Clock, CheckCircle2, XCircle, ArrowRight, Users, ClipboardCheck, TrendingUp } from 'lucide-react';
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

export default async function AdminDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return null;

  // 1. Fetch Stats
  const [pendingCount, verifiedThisMonth, rejectedTotal] = await Promise.all([
    prisma.prestasi.count({ where: { statusValidasi: 'PENDING' } }),
    prisma.prestasi.count({ 
      where: { 
        statusValidasi: 'APPROVED',
        tanggalValidasi: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      } 
    }),
    prisma.prestasi.count({ where: { statusValidasi: 'REJECTED' } })
  ]);

  // 2. Fetch Recent Activities (Verifications by this admin in last 24h)
  const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentActivities = await prisma.prestasi.findMany({
    where: {
      validatorId: session.user.id,
      tanggalValidasi: { gte: last24h }
    },
    include: {
      mahasiswa: {
        include: {
          user: true
        }
      }
    },
    orderBy: { tanggalValidasi: 'desc' },
    take: 5
  });

  return (
    <div className="flex flex-col gap-6 pb-8 font-sans animate-in fade-in duration-500">
      <div>
        <h1 className="text-[28px] font-bold text-[#1a1a1a] tracking-tight">Dashboard Admin</h1>
        <p className="text-gray-500 text-[15px] mt-1">Kelola dan verifikasi prestasi mahasiswa Fakultas Rekayasa Industri</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <span className="text-gray-500 font-medium text-[15px]">Antrean Pending</span>
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-amber-50"><Clock className="text-amber-500 h-5 w-5" /></div>
          </div>
          <h3 className="text-[32px] font-bold text-gray-900 leading-none mt-auto">{pendingCount}</h3>
          <span className="text-[13px] text-gray-500 mt-2">Menunggu verifikasi</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <span className="text-gray-500 font-medium text-[15px]">Total Diverifikasi Bulan Ini</span>
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-green-50"><CheckCircle2 className="text-[#50c878] h-5 w-5" /></div>
          </div>
          <h3 className="text-[32px] font-bold text-gray-900 leading-none mt-auto">{verifiedThisMonth}</h3>
          <span className="text-[13px] text-gray-500 mt-2">Bulan {new Date().toLocaleString('id-ID', { month: 'long' })}</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <span className="text-gray-500 font-medium text-[15px]">Total Ditolak</span>
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-red-50"><XCircle className="text-red-500 h-5 w-5" /></div>
          </div>
          <h3 className="text-[32px] font-bold text-gray-900 leading-none mt-auto">{rejectedTotal}</h3>
          <span className="text-[13px] text-gray-500 mt-2">Seluruh waktu</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Link href="/admin/verifikasi" className="block p-8 rounded-2xl bg-[#50c878] hover:bg-[#43b569] transition-all group">
          <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-white/20 mb-4">
            <ClipboardCheck className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-[20px] font-bold text-white mb-2 flex items-center gap-2">Mulai Verifikasi <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" /></h3>
          <p className="text-white/80 text-[15px]">{pendingCount} pengajuan menunggu verifikasi Anda</p>
        </Link>
        <div className="p-8 rounded-2xl border border-gray-200 bg-white group opacity-60 cursor-not-allowed">
          <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-[#50c878]/10 mb-4">
            <Users className="h-6 w-6 text-[#50c878]" />
          </div>
          <h3 className="text-[20px] font-bold text-gray-900 mb-2 flex items-center gap-2">Kelola Mahasiswa <ArrowRight className="h-5 w-5 text-gray-400" /></h3>
          <p className="text-gray-500 text-[15px]">Fitur manajemen data master mahasiswa</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-[18px] font-semibold text-[#1a1a1a]">Aktivitas Terkini</h2>
            <p className="text-gray-500 text-[14px] mt-1">Verifikasi yang baru saja Anda lakukan (24 jam terakhir)</p>
          </div>
          <TrendingUp className="h-5 w-5 text-gray-400" />
        </div>
        <div className="flex flex-col divide-y divide-gray-100">
          {recentActivities.length > 0 ? (
            recentActivities.map((item) => (
              <div key={item.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-start gap-4">
                  <span className={`font-semibold text-[13px] px-3 py-1 rounded-full mt-0.5 ${item.statusValidasi === 'APPROVED' ? 'bg-[#eafaf1] text-[#50c878]' : 'bg-red-50 text-red-500'}`}>
                    {item.statusValidasi === 'APPROVED' ? 'Valid' : 'Ditolak'}
                  </span>
                  <div>
                    <h4 className="text-[15px] font-semibold text-gray-900">{item.namaPrestasi}</h4>
                    <p className="text-[14px] text-gray-500 mt-1">Mahasiswa: {item.mahasiswa.user.name}</p>
                  </div>
                </div>
                <span className="text-[13px] text-gray-400">
                  {item.tanggalValidasi ? formatDistanceToNow(item.tanggalValidasi, { addSuffix: true, locale: id }) : '-'}
                </span>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-500 text-[14px]">
              Belum ada aktivitas verifikasi dalam 24 jam terakhir.
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#eafaf1] border border-[#50c878]/30 rounded-2xl p-6 flex items-start gap-4">
        <CheckCircle2 className="h-6 w-6 text-[#50c878] mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="text-[15px] font-bold text-[#006400]">Info Sistem</h4>
          <p className="text-[14px] text-[#004d00]/80 mt-1">Sistem sinkron dengan database terbaru. Gunakan menu Verifikasi untuk memproses pengajuan yang masuk.</p>
        </div>
      </div>
    </div>
  );
}
