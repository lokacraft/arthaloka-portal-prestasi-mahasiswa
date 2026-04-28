export const dynamic = 'force-dynamic';

import React from 'react';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import DetailVerifikasiContent from './DetailVerifikasiContent';

export default async function DetailVerifikasiPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const prestasi = await prisma.prestasi.findUnique({
    where: { id: id },
    include: {
      mahasiswa: {
        include: {
          user: true
        }
      },
      kategori: true,
      tingkat: true,
      validator: true,
    }
  });

  if (!prestasi) {
    notFound();
  }

  const kategoriList = await prisma.kategoriPrestasi.findMany({
    orderBy: { nama: 'asc' }
  });

  const tingkatList = await prisma.tingkatPrestasi.findMany({
    orderBy: { bobotPoin: 'asc' }
  });

  return (
    <DetailVerifikasiContent 
      prestasi={prestasi} 
      kategoriList={kategoriList} 
      tingkatList={tingkatList} 
    />
  );
}
