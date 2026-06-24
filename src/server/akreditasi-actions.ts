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

export async function getRekapPrestasiAkreditasi(tahunSasaran: number, rentangTahun: number, kategoriFilter?: string, programStudiId?: string) {
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

    // Filter program studi (untuk kaprodi)
    if (programStudiId && programStudiId !== 'Semua') {
      query.programStudiId = programStudiId;
    }

    // Filter berdasarkan kategori menggunakan kategoriId relasi
    if (kategoriFilter && kategoriFilter !== 'Semua') {
      if (kategoriFilter === 'Akademik' || kategoriFilter === 'Non-Akademik') {
        const katAkademik = await prisma.kategoriPrestasi.findFirst({
          where: { nama: { contains: 'Akademik', mode: 'insensitive' } }
        });
        if (katAkademik) {
          query.kategoriId = kategoriFilter === 'Akademik' ? katAkademik.id : { not: katAkademik.id };
        }
      } else {
        query.kategoriId = kategoriFilter;
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

export async function getTrendPrestasi(tahunSasaran: number, rentangTahun: number = 5, programStudiId?: string, kategoriFilter?: string) {
  try {
    const startYear = tahunSasaran - rentangTahun + 1;
    
    // Ambil data
    const whereClause: any = {
      statusValidasi: 'APPROVED',
      tahun: {
        gte: startYear,
        lte: tahunSasaran,
      },
    };

    // Filter program studi (untuk kaprodi)
    if (programStudiId && programStudiId !== 'Semua') {
      whereClause.programStudiId = programStudiId;
    }

    if (kategoriFilter && kategoriFilter !== 'Semua') {
      if (kategoriFilter === 'Akademik' || kategoriFilter === 'Non-Akademik') {
        const katAkademik = await prisma.kategoriPrestasi.findFirst({
          where: { nama: { contains: 'Akademik', mode: 'insensitive' } }
        });
        if (katAkademik) {
          whereClause.kategoriId = kategoriFilter === 'Akademik' ? katAkademik.id : { not: katAkademik.id };
        }
      } else {
        whereClause.kategoriId = kategoriFilter;
      }
    }

    const prestasiList = await prisma.prestasi.findMany({
      where: whereClause,
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
  angkatan,
  programStudiId,
}: { 
  tahun?: number, 
  startYear?: number,
  endYear?: number,
  kategoriId?: string, 
  levelId?: string, 
  angkatan?: number,
  programStudiId?: string,
}) {
  try {
    const query: any = { statusValidasi: 'APPROVED' };

    if (startYear && endYear) {
      query.tahun = { gte: startYear, lte: endYear };
    } else if (tahun) {
      query.tahun = tahun;
    }
    if (levelId && levelId !== 'Semua') query.tingkatId = levelId;

    // Filter Program Studi (untuk kaprodi)
    if (programStudiId && programStudiId !== 'Semua') {
      query.programStudiId = programStudiId;
    }
    
    // Filter Kategori
    if (kategoriId && kategoriId !== 'Semua') {
      if (kategoriId === 'Akademik' || kategoriId === 'Non-Akademik' || kategoriId === 'NON_AKADEMIK') {
        const katAkademik = await prisma.kategoriPrestasi.findFirst({
          where: { nama: { contains: 'Akademik', mode: 'insensitive' } }
        });
        if (katAkademik) {
          query.kategoriId = kategoriId === 'Akademik' ? katAkademik.id : { not: katAkademik.id };
        }
      } else {
        query.kategoriId = kategoriId;
      }
    }

    // Filter Angkatan Mahasiswa
    if (angkatan) {
      query.angkatan = angkatan;
    }

    let data = await prisma.prestasi.findMany({
      where: query,
      include: {
        mahasiswa: {
          include: { user: { select: { name: true, email: true } } },
        },
        kategori: true,
        tingkat: true,
        programStudi: true,
      },
      orderBy: { tahun: 'desc' }
    });

    return data;
  } catch (error) {
    console.error("Error fetching rekap lengkap:", error);
    throw new Error("Gagal mengambil data Rekap Lengkap");
  }
}

export async function getDetailPrestasiExport(tahunSasaran: number, rentangTahun: number, programStudiId?: string) {
  try {
    const startYear = tahunSasaran - rentangTahun + 1;
    const endYear = tahunSasaran;

    const where: any = {
      statusValidasi: 'APPROVED',
      tahun: {
        gte: startYear,
        lte: endYear,
      },
    };

    if (programStudiId && programStudiId !== 'Semua') {
      where.programStudiId = programStudiId;
    }

    const data = await prisma.prestasi.findMany({
      where,
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

export async function getProgramStudiByNama(nama: string) {
  try {
    return await prisma.programStudi.findUnique({
      where: { nama }
    });
  } catch (error) {
    console.error("Error fetching program studi by nama:", error);
    return null;
  }
}

// ============================================================================
// DETAIL PRESTASI (untuk halaman detail kaprodi & WD)
// ============================================================================

export async function getPrestasiDetail(id: string) {
  try {
    return await prisma.prestasi.findUnique({
      where: { id, statusValidasi: 'APPROVED' },
      include: {
        mahasiswa: {
          include: {
            user: { select: { name: true, email: true } },
            programStudi: true,
          },
        },
        kategori: true,
        tingkat: true,
        programStudi: true,
        validator: { select: { name: true } },
      },
    });
  } catch (error) {
    console.error('Error fetching prestasi detail:', error);
    throw new Error('Gagal mengambil detail prestasi');
  }
}

// ============================================================================
// TREN PER PRODI (untuk chart WD dashboard)
// ============================================================================

/** Mapping nama prodi → kunci pendek untuk chart key */
function mapProdiKey(nama: string): string {
  const n = nama.toLowerCase();
  // Periksa 'rekayasa'/'manajemen' DULU — "Manajemen Rekayasa Industri" juga mengandung 'industri'
  if (n.includes('rekayasa') || n.includes('manajemen')) return 'mri';
  if (n.includes('logistik')) return 'tl';
  if (n.includes('industri')) return 'ti';
  return nama.substring(0, 3).toLowerCase().replace(/\s/g, '');
}

export async function getTrendPerProdi(tahunSasaran: number, rentangTahun: number = 5) {
  try {
    const startYear = tahunSasaran - rentangTahun + 1;

    const prodiList = await prisma.programStudi.findMany({ orderBy: { nama: 'asc' } });

    const prodiKeyMap: Record<string, string> = {};
    prodiList.forEach((p) => { prodiKeyMap[p.id] = mapProdiKey(p.nama); });

    const prestasiList = await prisma.prestasi.findMany({
      where: {
        statusValidasi: 'APPROVED',
        tahun: { gte: startYear, lte: tahunSasaran },
      },
      select: { tahun: true, programStudiId: true },
    });

    // Inisialisasi struktur tren
    const trendMap: Record<number, Record<string, number | string>> = {};
    for (let y = startYear; y <= tahunSasaran; y++) {
      trendMap[y] = { year: y.toString() };
      prodiList.forEach((p) => { trendMap[y][prodiKeyMap[p.id]] = 0; });
    }

    prestasiList.forEach((p) => {
      if (!p.programStudiId || !trendMap[p.tahun]) return;
      const key = prodiKeyMap[p.programStudiId];
      if (key) trendMap[p.tahun][key] = (trendMap[p.tahun][key] as number) + 1;
    });

    return {
      data: Object.values(trendMap).sort((a, b) => parseInt(a.year as string) - parseInt(b.year as string)),
      prodiList: prodiList.map((p) => ({ id: p.id, nama: p.nama, key: prodiKeyMap[p.id] })),
    };
  } catch (error) {
    console.error('Error fetching trend per prodi:', error);
    throw new Error('Gagal mengambil data tren per prodi');
  }
}

// ============================================================================
// DISTRIBUSI KATEGORI PER PRODI (untuk bar chart WD)
// ============================================================================

export async function getDistribusiKategoriPerProdi(startYear: number, endYear: number) {
  try {
    const prodiList = await prisma.programStudi.findMany({ orderBy: { nama: 'asc' } });

    const prodiKeyMap: Record<string, string> = {};
    prodiList.forEach((p) => { prodiKeyMap[p.id] = mapProdiKey(p.nama); });

    const prestasiList = await prisma.prestasi.findMany({
      where: {
        statusValidasi: 'APPROVED',
        tahun: { gte: startYear, lte: endYear },
      },
      select: {
        programStudiId: true,
        kategori: { select: { nama: true } },
      },
    });

    // Inisialisasi: { 'Akademik': { ti: 0, tl: 0, mri: 0 }, 'Non Akademik': { ... } }
    const result: Record<string, Record<string, number>> = {
      Akademik: {},
      'Non Akademik': {},
    };
    prodiList.forEach((p) => {
      result['Akademik'][prodiKeyMap[p.id]] = 0;
      result['Non Akademik'][prodiKeyMap[p.id]] = 0;
    });

    prestasiList.forEach((p) => {
      if (!p.programStudiId) return;
      const katNama = p.kategori?.nama ?? '';
      const isAkademik = katNama.toLowerCase().includes('akademik') && !katNama.toLowerCase().includes('non');
      const katKey = isAkademik ? 'Akademik' : 'Non Akademik';
      const prodiKey = prodiKeyMap[p.programStudiId];
      if (prodiKey) result[katKey][prodiKey] = (result[katKey][prodiKey] ?? 0) + 1;
    });

    return {
      data: Object.entries(result).map(([label, counts]) => ({ label, ...counts })),
      prodiList: prodiList.map((p) => ({ id: p.id, nama: p.nama, key: prodiKeyMap[p.id] })),
    };
  } catch (error) {
    console.error('Error fetching distribusi kategori per prodi:', error);
    throw new Error('Gagal mengambil data distribusi per prodi');
  }
}
