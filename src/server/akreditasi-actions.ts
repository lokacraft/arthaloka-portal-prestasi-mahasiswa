"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ============================================================================
// NMTS (Jumlah Mahasiswa Tahun Sasaran)
// ============================================================================

export async function getNmTs(tahun?: number) {
  try {
    if (tahun) {
      return await prisma.nmTs.findUnique({
        where: { tahun },
      });
    }
    return await prisma.nmTs.findMany({
      orderBy: { tahun: 'desc' },
    });
  } catch (error) {
    console.error("Error fetching NmTs:", error);
    throw new Error("Gagal mengambil data NM(TS)");
  }
}

export async function upsertNmTs(tahun: number, jumlahMahasiswa: number) {
  try {
    const result = await prisma.nmTs.upsert({
      where: { tahun },
      update: { jumlahMahasiswa },
      create: { tahun, jumlahMahasiswa },
    });
    revalidatePath("/admin/nmts");
    revalidatePath("/admin/indikator");
    return { success: true, data: result };
  } catch (error) {
    console.error("Error upserting NmTs:", error);
    return { success: false, error: "Gagal menyimpan data NM(TS)" };
  }
}

// ============================================================================
// TARGET AKREDITASI
// ============================================================================

const DEFAULT_TARGETS = [
  { kodeTarget: "RI", nama: "Target Rasio Internasional", nilaiPersen: 0.2 },
  { kodeTarget: "RN", nama: "Target Rasio Nasional", nilaiPersen: 2.0 },
  { kodeTarget: "RW", nama: "Target Rasio Wilayah/Lokal", nilaiPersen: 4.0 },
];

export async function getTargets() {
  try {
    const targets = await prisma.targetAkreditasi.findMany();
    
    // Seed default targets if none exist
    if (targets.length === 0) {
      await prisma.targetAkreditasi.createMany({
        data: DEFAULT_TARGETS,
      });
      return await prisma.targetAkreditasi.findMany();
    }
    
    return targets;
  } catch (error) {
    console.error("Error fetching Targets:", error);
    throw new Error("Gagal mengambil data Target Akreditasi");
  }
}

export async function updateTarget(kodeTarget: string, nilaiPersen: number) {
  try {
    const result = await prisma.targetAkreditasi.update({
      where: { kodeTarget },
      data: { nilaiPersen },
    });
    revalidatePath("/admin/indikator");
    return { success: true, data: result };
  } catch (error) {
    console.error("Error updating Target:", error);
    return { success: false, error: "Gagal mengupdate Target Akreditasi" };
  }
}

// ============================================================================
// REKAP & PERHITUNGAN PRESTASI
// ============================================================================

export async function getRekapPrestasiAkreditasi(tahunSasaran: number, rentangTahun: number, kategoriFilter?: string) {
  try {
    const startYear = tahunSasaran - rentangTahun + 1;
    const endYear = tahunSasaran;

    // Ambil prestasi yang APPROVED dalam rentang tahun tsb
    const query: any = {
      statusValidasi: 'APPROVED',
      tahun: {
        gte: startYear,
        lte: endYear,
      },
    };

    // Filter berdasarkan kategori menggunakan kategoriId relasi
    if (kategoriFilter && kategoriFilter !== 'Semua') {
      // Cari ID kategori 'Akademik'
      const katAkademik = await prisma.kategoriPrestasi.findFirst({
        where: { nama: { contains: 'Akademik', mode: 'insensitive' } }
      });

      if (katAkademik) {
        if (kategoriFilter === 'Akademik') {
          query.kategoriId = katAkademik.id;
        } else if (kategoriFilter === 'Non-Akademik') {
          query.kategoriId = { not: katAkademik.id };
        }
      }
    }

    const prestasiList = await prisma.prestasi.findMany({
      where: query,
      include: {
        tingkat: true,
      },
    });

    const result = { NI: 0, NN: 0, NW: 0 };

    const getLevelKey = (namaTingkat: string): 'NI' | 'NN' | 'NW' | null => {
      const nama = namaTingkat.toLowerCase();
      if (nama.includes('internasional')) return 'NI';
      if (nama.includes('nasional')) return 'NN';
      if (nama.includes('wilayah') || nama.includes('lokal') || nama.includes('provinsi') || 
          nama.includes('universitas') || nama.includes('kabupaten') || nama.includes('kota')) return 'NW';
      return null;
    };

    for (const p of prestasiList) {
      const levelKey = getLevelKey(p.tingkat.nama);
      if (levelKey) {
        result[levelKey]++;
      }
    }

    return result;
  } catch (error) {
    console.error("DETAILED REKAP ERROR:", error);
    throw new Error("Gagal mengambil data Rekap Prestasi. Periksa koneksi database atau skema kategori.");
  }
}

// ============================================================================
// DATA UNTUK GRAFIK & REKAP (HALAMAN AKREDITASI)
// ============================================================================

export async function getTrendPrestasi(tahunSasaran: number, rentangTahun: number = 5) {
  try {
    const startYear = tahunSasaran - rentangTahun + 1;
    
    // Ambil data
    const prestasiList = await prisma.prestasi.findMany({
      where: {
        statusValidasi: 'APPROVED',
        tahun: {
          gte: startYear,
          lte: tahunSasaran,
        },
      },
      include: {
        tingkat: true,
      },
    });

    // Inisialisasi struktur { year: { int: 0, nas: 0, wil: 0 } }
    const trendMap: Record<number, { year: string, int: number, nas: number, wil: number }> = {};
    for (let y = startYear; y <= tahunSasaran; y++) {
      trendMap[y] = { year: y.toString(), int: 0, nas: 0, wil: 0 };
    }

    const getLevelKey = (namaTingkat: string): 'int' | 'nas' | 'wil' | null => {
      const nama = namaTingkat.toLowerCase();
      if (nama.includes('internasional')) return 'int';
      if (nama.includes('nasional')) return 'nas';
      if (nama.includes('wilayah') || nama.includes('lokal') || nama.includes('provinsi') || 
          nama.includes('universitas') || nama.includes('kabupaten') || nama.includes('kota')) return 'wil';
      return null;
    };

    for (const p of prestasiList) {
      if (trendMap[p.tahun]) {
        const levelKey = getLevelKey(p.tingkat.nama);
        if (levelKey) {
          trendMap[p.tahun][levelKey]++;
        }
      }
    }

    // Convert to array sorted by year
    return Object.values(trendMap).sort((a, b) => parseInt(a.year) - parseInt(b.year));
  } catch (error) {
    console.error("Error fetching trend prestasi:", error);
    throw new Error("Gagal mengambil data Trend Prestasi");
  }
}

export async function getRekapLengkap({ 
  tahun, 
  startYear,
  endYear,
  kategoriId, 
  levelId, 
  angkatan 
}: { 
  tahun?: number, 
  startYear?: number,
  endYear?: number,
  kategoriId?: string, 
  levelId?: string, 
  angkatan?: number 
}) {
  try {
    const query: any = { statusValidasi: 'APPROVED' };

    if (startYear && endYear) {
      query.tahun = { gte: startYear, lte: endYear };
    } else if (tahun) {
      query.tahun = tahun;
    }
    if (levelId && levelId !== 'Semua') query.tingkatId = levelId;
    
    // Filter Kategori
    if (kategoriId && kategoriId !== 'Semua') {
      if (kategoriId === 'NON_AKADEMIK') {
        const katAkademik = await prisma.kategoriPrestasi.findFirst({
          where: { nama: { contains: 'Akademik', mode: 'insensitive' } }
        });
        if (katAkademik) query.kategoriId = { not: katAkademik.id };
      } else {
        query.kategoriId = kategoriId;
      }
    }

    // Filter Angkatan Mahasiswa
    if (angkatan) {
      // Assuming NIM format or need to fetch Mahasiswa first?
      // Since 'angkatan' is not directly in Mahasiswa model, 
      // let's try to infer it from NIM. Usually NIM first 2 or 4 digits.
      // But for now, since it's hard to parse string reliably in Prisma where,
      // we might have to filter in JS or skip if Angkatan is not in schema.
      // I'll filter it in JS after fetching for safety if 'angkatan' is provided.
    }

    let data = await prisma.prestasi.findMany({
      where: query,
      include: {
        mahasiswa: true,
        kategori: true,
        tingkat: true,
      },
      orderBy: { tahun: 'desc' }
    });

    if (angkatan) {
      // Very basic NIM inference for angkatan (e.g. 2023 from '23xxxxx' or '2023xxxx')
      data = data.filter(d => d.mahasiswa.nim.includes(angkatan.toString().slice(-2)));
    }

    return data;
  } catch (error) {
    console.error("Error fetching rekap lengkap:", error);
    throw new Error("Gagal mengambil data Rekap Lengkap");
  }
}

export async function getDetailPrestasiExport(tahunSasaran: number, rentangTahun: number) {
  try {
    const startYear = tahunSasaran - rentangTahun + 1;
    const endYear = tahunSasaran;

    const data = await prisma.prestasi.findMany({
      where: {
        statusValidasi: 'APPROVED',
        tahun: {
          gte: startYear,
          lte: endYear,
        },
      },
      include: {
        mahasiswa: true,
        kategori: true,
        tingkat: true,
      },
      orderBy: {
        tahun: 'desc',
      }
    });

    return data;
  } catch (error) {
    console.error("Error fetching export data:", error);
    throw new Error("Gagal mengambil data Export Prestasi");
  }
}

export async function getKategoriPrestasi() {
  try {
    return await prisma.kategoriPrestasi.findMany({
      orderBy: { nama: 'asc' }
    });
  } catch (error) {
    console.error("Error fetching kategori:", error);
    throw new Error("Gagal mengambil data kategori");
  }
}
