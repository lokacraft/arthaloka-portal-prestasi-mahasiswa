"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export interface CurrentUserInfo {
  userId: string;
  name: string;
  email: string;
  nim: string;
  mahasiswaId: string;
  image?: string | null;
}

/**
 * Mendapatkan info user yang sedang login (userId, name, NIM, mahasiswaId).
 */
export async function getCurrentUser(): Promise<CurrentUserInfo | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) return null;

    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
        nim: true,
        user: { select: { name: true, email: true } },
      },
    });

    if (!mahasiswa) return null;

    return {
      userId: session.user.id,
      name: session.user.name,
      email: session.user.email,
      nim: mahasiswa?.nim || "",
      mahasiswaId: mahasiswa?.id || "",
      image: session.user.image,
    };
  } catch (error) {
    console.error("getCurrentUser Error:", error);
    return null;
  }
}

export async function updateUserProfile(data: { name?: string; image?: string }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) return { error: "Not authenticated" };

    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.image) updateData.image = data.image;

    await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    return { success: true };
  } catch (error) {
    console.error("updateUserProfile Error:", error);
    return { error: "Gagal menyimpan profil" };
  }
}
