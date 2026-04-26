"use server";

import prisma from "@/lib/prisma";
import { Semester, TipePartisipasi } from "@/generated/prisma";
import { revalidatePath } from "next/cache";

// =====================================================================
// TYPES
// =====================================================================

export interface PrestasiStats {
  pending: number;
  approved: number;
  rejected: number;
}

export interface CreatePrestasiInput {
  mahasiswaId: string;
  kategoriId: string;
  tingkatId: string;
  tahun: number;
  semester: Semester;
  namaPrestasi: string;
  namaPenyelenggara: string;
  tanggalPelaksanaan: Date;
  hasilCapaian: string;
  provinsi?: string;
  kota?: string;
  namaLokasi?: string;
  tipePartisipasi: TipePartisipasi;
  anggotaTim?: { nim: string; nama: string }[];
  sertifikatUrl?: string;
  buktiBuktiUrls?: string[];
  keterangan?: string;
}

// =====================================================================
// READ ACTIONS
// =====================================================================

/**
 * Get stats (pending, approved, rejected) for a mahasiswa.
 */
export async function getPrestasiStats(mahasiswaId: string): Promise<PrestasiStats> {
  const [pending, approved, rejected] = await Promise.all([
    prisma.prestasi.count({ where: { mahasiswaId, statusValidasi: "PENDING" } }),
    prisma.prestasi.count({ where: { mahasiswaId, statusValidasi: "APPROVED" } }),
    prisma.prestasi.count({ where: { mahasiswaId, statusValidasi: "REJECTED" } }),
  ]);
  return { pending, approved, rejected };
}

/**
 * Get paginated recent prestasi for dashboard.
 */
export async function getRecentPrestasi(
  mahasiswaId: string,
  page: number = 1,
  perPage: number = 10
) {
  const skip = (page - 1) * perPage;

  const [data, total] = await Promise.all([
    prisma.prestasi.findMany({
      where: { mahasiswaId },
      orderBy: { createdAt: "desc" },
      skip,
      take: perPage,
      include: {
        kategori: { select: { nama: true } },
        tingkat: { select: { nama: true } },
      },
    }),
    prisma.prestasi.count({ where: { mahasiswaId } }),
  ]);

  return { data, total, page, perPage, totalPages: Math.ceil(total / perPage) };
}

/**
 * Get all prestasi with filters, search, and pagination for riwayat page.
 */
export async function getAllPrestasiByMahasiswa(
  mahasiswaId: string,
  options: {
    page?: number;
    perPage?: number;
    search?: string;
    tahun?: number;
    status?: "PENDING" | "APPROVED" | "REJECTED";
  } = {}
) {
  const { page = 1, perPage = 10, search, tahun, status } = options;
  const skip = (page - 1) * perPage;

  const where: Parameters<typeof prisma.prestasi.findMany>[0]["where"] = {
    mahasiswaId,
    ...(search ? { namaPrestasi: { contains: search, mode: "insensitive" } } : {}),
    ...(tahun ? { tahun } : {}),
    ...(status ? { statusValidasi: status } : {}),
  };

  const [data, total] = await Promise.all([
    prisma.prestasi.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: perPage,
      include: {
        kategori: { select: { nama: true } },
        tingkat: { select: { nama: true } },
      },
    }),
    prisma.prestasi.count({ where }),
  ]);

  return { data, total, page, perPage, totalPages: Math.ceil(total / perPage) };
}

/**
 * Get a single prestasi by ID.
 */
export async function getPrestasiById(id: string) {
  return prisma.prestasi.findUnique({
    where: { id },
    include: {
      kategori: true,
      tingkat: true,
      mahasiswa: {
        include: { user: { select: { name: true, email: true } } },
      },
      validator: { select: { name: true } },
    },
  });
}

/**
 * Get unique years for which a mahasiswa has prestasi (for filter dropdown).
 */
export async function getPrestasiYears(mahasiswaId: string): Promise<number[]> {
  const results = await prisma.prestasi.findMany({
    where: { mahasiswaId },
    select: { tahun: true },
    distinct: ["tahun"],
    orderBy: { tahun: "desc" },
  });
  return results.map((r) => r.tahun);
}

/**
 * Get all kategori prestasi for form.
 */
export async function getKategoriList() {
  return prisma.kategoriPrestasi.findMany({ orderBy: { nama: "asc" } });
}

/**
 * Get all tingkat prestasi for form.
 */
export async function getTingkatList() {
  return prisma.tingkatPrestasi.findMany({ orderBy: { bobotPoin: "desc" } });
}

// =====================================================================
// WRITE ACTIONS
// =====================================================================

/**
 * Create a new prestasi entry.
 */
export async function createPrestasi(input: CreatePrestasiInput) {
  try {
    const prestasi = await prisma.prestasi.create({
      data: {
        mahasiswaId: input.mahasiswaId,
        kategoriId: input.kategoriId,
        tingkatId: input.tingkatId,
        tahun: input.tahun,
        semester: input.semester,
        namaPrestasi: input.namaPrestasi,
        namaPenyelenggara: input.namaPenyelenggara,
        tanggalPelaksanaan: input.tanggalPelaksanaan,
        hasilCapaian: input.hasilCapaian,
        provinsi: input.provinsi,
        kota: input.kota,
        namaLokasi: input.namaLokasi,
        tipePartisipasi: input.tipePartisipasi,
        anggotaTim: input.anggotaTim ?? undefined,
        sertifikatUrl: input.sertifikatUrl,
        buktiBuktiUrls: input.buktiBuktiUrls ?? undefined,
        keterangan: input.keterangan,
        statusValidasi: "PENDING",
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/riwayat");

    return { success: true, id: prestasi.id };
  } catch (error) {
    console.error("createPrestasi Error:", error);
    return { error: "Gagal menyimpan data prestasi." };
  }
}

/**
 * Delete a prestasi (only if PENDING — not yet validated).
 */
export async function deletePrestasi(id: string, mahasiswaId: string) {
  try {
    const prestasi = await prisma.prestasi.findUnique({ where: { id } });

    if (!prestasi || prestasi.mahasiswaId !== mahasiswaId) {
      return { error: "Data tidak ditemukan." };
    }

    if (prestasi.statusValidasi !== "PENDING") {
      return { error: "Prestasi yang sudah divalidasi tidak dapat dihapus." };
    }

    await prisma.prestasi.delete({ where: { id } });

    revalidatePath("/dashboard");
    revalidatePath("/riwayat");

    return { success: true };
  } catch (error) {
    console.error("deletePrestasi Error:", error);
    return { error: "Gagal menghapus data prestasi." };
  }
}
