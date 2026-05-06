"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function registerMahasiswaAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const nim = formData.get("nim") as string;

  if (!name || !email || !password || !nim) {
    return { error: "Semua field wajib diisi!" };
  }

  try {
    // 1. Validasi: Cek apakah NIM sudah terdaftar
    const existingMahasiswa = await prisma.mahasiswa.findUnique({
      where: { nim },
    });

    if (existingMahasiswa) {
      return { error: "NIM tersebut sudah terdaftar dalam sistem." };
    }

    // 2. Validasi: Cek apakah Email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Email tersebut sudah digunakan." };
    }

    // 3. Proses Registrasi via Better Auth API
    // Ini otomatis melakukan hashing password dan menyimpan ke tabel User & Account
    const authResponse = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    if (!authResponse || !authResponse.user) {
      return { error: "Terjadi kesalahan saat mendaftarkan akun." };
    }

    const userId = authResponse.user.id;

    // 4. Siapkan Role "MAHASISWA"
    let role = await prisma.role.findUnique({
      where: { name: "MAHASISWA" },
    });

    // Buat role MAHASISWA jika belum ada di database
    if (!role) {
      role = await prisma.role.create({
        data: {
          name: "MAHASISWA",
          description: "Role akses standar untuk mahasiswa",
        },
      });
    }

    // 5. Hubungkan User dengan Role (tabel UserRole)
    await prisma.userRole.create({
      data: {
        userId: userId,
        roleId: role.id,
      },
    });

    // 6. Buat Profil Mahasiswa
    await prisma.mahasiswa.create({
      data: {
        userId: userId,
        nim: nim,
      },
    });

    return { success: true, message: "Registrasi berhasil! Silakan login." };
  } catch (error: any) {
    console.error("Registration Error:", error);
    return { error: error?.message || "Terjadi kesalahan pada server saat registrasi." };
  }
}

/**
 * Catatan Implementasi Login:
 * Untuk login, sangat direkomendasikan menggunakan `authClient.signIn.email` 
 * langsung dari Client Component (Frontend) dibandingkan melalui Server Action.
 * Hal ini karena Better Auth menangani penempatan Cookie Session secara otomatis
 * dan aman di browser melalui API Route `/api/auth/...`.
 * 
 * Namun, jika Anda membutuhkan validasi tambahan sebelum login (misal mengecek status), 
 * Anda bisa menggunakan fungsi di bawah ini sebagai middleware validasi.
 */
export async function validateLoginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email dan password wajib diisi!" };
  }

  // Cek apakah user ada
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { error: "Akun tidak ditemukan." };
  }

  // Jika berhasil melewati validasi khusus, kembalikan success.
  // Frontend kemudian akan memanggil authClient.signIn.email() untuk mengeksekusi login & set cookie.
  return { success: true };
}

import { headers, cookies } from "next/headers";

export async function logoutAction() {
  try {
    // Memanggil API Sign Out dari Better Auth di sisi Server
    await auth.api.signOut({
      headers: await headers()
    });

    // Membersihkan session cookie secara manual untuk memastikan user benar-benar logout
    (await cookies()).delete("better-auth.session_token");
    (await cookies()).delete("app_role");

    return { success: true };
  } catch (error) {
    console.error("Logout Error:", error);
    return { error: "Terjadi kesalahan saat mencoba keluar." };
  }
}

export async function setLoginCookieAndGetRedirectUrl(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      userRoles: {
        include: { role: true }
      }
    }
  });

  if (!user) return "/dashboard";

  let mainRole = "MAHASISWA";
  let redirectUrl = "/dashboard";

  const hasAdmin = user.userRoles.some(ur => ur.role.name.toUpperCase() === "ADMIN");
  const hasWD = user.userRoles.some(ur => ur.role.name.toUpperCase() === "WD");
  const hasKaprodi = user.userRoles.some(ur => ur.role.name.toUpperCase() === "KAPRODI");
  const hasAkreditasi = user.userRoles.some(ur => ur.role.name.toUpperCase() === "AKREDITASI");

  if (hasAdmin) {
    mainRole = "ADMIN";
    redirectUrl = "/admin/dashboard";
  } else if (hasWD) {
    mainRole = "WD";
    redirectUrl = "/wd1/dashboard";
  } else if (hasKaprodi) {
    mainRole = "KAPRODI";
    redirectUrl = "/kaprodi/dashboard";
  } else if (hasAkreditasi) {
    mainRole = "AKREDITASI";
    redirectUrl = "/akreditasi/dashboard";
  }

  const c = await cookies();
  c.set("app_role", mainRole, { path: "/", httpOnly: true, sameSite: "lax" });

  return redirectUrl;
}
