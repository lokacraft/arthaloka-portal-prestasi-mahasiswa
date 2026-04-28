"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

/**
 * Validate/Approve an achievement
 */
export async function validateAchievement(id: string, catatan: string, poin: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return { error: "Unauthorized" };

  try {
    const prestasi = await prisma.prestasi.update({
      where: { id },
      data: {
        statusValidasi: 'APPROVED',
        validatorId: session.user.id,
        catatanValidasi: catatan,
        tanggalValidasi: new Date(),
        poin: poin
      },
      include: { mahasiswa: { select: { userId: true } } }
    });

    // Notify Mahasiswa
    if (prestasi.mahasiswa?.userId) {
      await prisma.notification.create({
        data: {
          userId: prestasi.mahasiswa.userId,
          title: "Prestasi Disetujui",
          message: `Prestasi '${prestasi.namaPrestasi}' telah disetujui. Catatan: ${catatan || '-'}`,
          type: "SUCCESS",
          linkUrl: `/riwayat`,
        }
      });
    }

    // Notify Admin (history log)
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        title: "Riwayat Validasi",
        message: `Anda telah menyetujui prestasi '${prestasi.namaPrestasi}'.`,
        type: "INFO",
        linkUrl: `/admin/verifikasi/${id}`,
      }
    });

    revalidatePath(`/admin/verifikasi/${id}`);
    revalidatePath("/admin/verifikasi");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Validate error:", error);
    return { error: "Gagal memvalidasi prestasi." };
  }
}

/**
 * Reject an achievement
 */
export async function rejectAchievement(id: string, catatan: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return { error: "Unauthorized" };

  try {
    const prestasi = await prisma.prestasi.update({
      where: { id },
      data: {
        statusValidasi: 'REJECTED',
        validatorId: session.user.id,
        catatanValidasi: catatan,
        tanggalValidasi: new Date(),
      },
      include: { mahasiswa: { select: { userId: true } } }
    });

    // Notify Mahasiswa
    if (prestasi.mahasiswa?.userId) {
      await prisma.notification.create({
        data: {
          userId: prestasi.mahasiswa.userId,
          title: "Prestasi Ditolak",
          message: `Prestasi '${prestasi.namaPrestasi}' ditolak. Catatan: ${catatan || '-'}`,
          type: "ERROR",
          linkUrl: `/riwayat`,
        }
      });
    }

    // Notify Admin (history log)
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        title: "Riwayat Validasi",
        message: `Anda telah menolak prestasi '${prestasi.namaPrestasi}'.`,
        type: "WARNING",
        linkUrl: `/admin/verifikasi/${id}`,
      }
    });

    revalidatePath(`/admin/verifikasi/${id}`);
    revalidatePath("/admin/verifikasi");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Reject error:", error);
    return { error: "Gagal menolak prestasi." };
  }
}

/**
 * Correct achievement data
 */
export async function correctAchievement(id: string, data: any) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return { error: "Unauthorized" };

  try {
    await prisma.prestasi.update({
      where: { id },
      data: {
        namaPrestasi: data.namaPrestasi,
        namaPenyelenggara: data.namaPenyelenggara,
        kategoriId: data.kategoriId,
        tingkatId: data.tingkatId,
        tahun: data.tahun,
        semester: data.semester,
        hasilCapaian: data.hasilCapaian,
        provinsi: data.provinsi,
        kota: data.kota,
        namaLokasi: data.namaLokasi,
      }
    });

    revalidatePath(`/admin/verifikasi/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Correction error:", error);
    return { error: "Gagal mengoreksi data prestasi." };
  }
}
