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
      name: mahasiswa.user.name,
      email: mahasiswa.user.email,
      nim: mahasiswa.nim,
      mahasiswaId: mahasiswa.id,
    };
  } catch (error) {
    console.error("getCurrentUser Error:", error);
    return null;
  }
}
