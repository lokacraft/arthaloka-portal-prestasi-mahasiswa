"use server";

import prisma from "@/lib/prisma";
import { Prisma, Semester, TipePartisipasi, JenisLomba } from "@/generated/prisma/client";
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
  programStudiId?: string;
  kategoriId: string;
  tingkatId: string;
  tahun: number;
  semester: Semester;
  angkatan: number;
  jenisLomba: JenisLomba;
  namaPrestasi: string;
  namaPenyelenggara: string;
  tanggalMulai: Date;
  tanggalSelesai: Date;
  hasilCapaian: string;
  provinsi?: string;
  kota?: string;
  namaLokasi?: string;
  tipePartisipasi: TipePartisipasi;
  anggotaTim?: { nim: string; nama: string; angkatan: number }[];
  sertifikatUrls?: string[];
  buktiBuktiUrls?: string[];
  keterangan?: string;
}

// =====================================================================
// READ ACTIONS
// =====================================================================

/**
 * Get all program studi list for form select.
 */
export async function getProgramStudiList() {
  return prisma.programStudi.findMany({ orderBy: { nama: "asc" } });
}

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
        programStudi: { select: { nama: true } },
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

  const where: Prisma.PrestasiWhereInput = {
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
        programStudi: { select: { nama: true } },
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
      programStudi: true,
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
        programStudiId: input.programStudiId ?? null,
        kategoriId: input.kategoriId,
        tingkatId: input.tingkatId,
        angkatan: input.angkatan,
        tahun: input.tahun,
        semester: input.semester,
        namaPrestasi: input.namaPrestasi,
        jenisLomba: input.jenisLomba,
        namaPenyelenggara: input.namaPenyelenggara,
        tanggalMulai: input.tanggalMulai,
        tanggalSelesai: input.tanggalSelesai,
        hasilCapaian: input.hasilCapaian,
        provinsi: input.provinsi,
        kota: input.kota,
        namaLokasi: input.namaLokasi,
        tipePartisipasi: input.tipePartisipasi,
        anggotaTim: input.anggotaTim ?? undefined,
        sertifikatUrls: input.sertifikatUrls ?? undefined,
        buktiBuktiUrls: input.buktiBuktiUrls ?? undefined,
        keterangan: input.keterangan,
        statusValidasi: "PENDING",
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/riwayat");

    // NOTIFIKASI: Broadcast ke Admin
    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { id: input.mahasiswaId },
      include: { user: true }
    });

    if (mahasiswa) {
      const adminRoles = await prisma.userRole.findMany({
        where: { role: { name: "ADMIN" } },
        select: { userId: true }
      });

      if (adminRoles.length > 0) {
        await prisma.notification.createMany({
          data: adminRoles.map((admin) => ({
            userId: admin.userId,
            title: "Pengajuan Prestasi Baru",
            message: `Ada pengajuan baru dari ${mahasiswa.user.name} - ${input.namaPrestasi}`,
            type: "INFO",
            linkUrl: `/admin/verifikasi/${prestasi.id}`,
          }))
        });
      }
    }

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
