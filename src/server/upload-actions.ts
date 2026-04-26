"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from "@/lib/r2";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

/**
 * Upload a single file to Cloudflare R2 and return its public URL.
 */
export async function uploadFileToR2(
  file: File,
  folder: string = "sertifikat"
): Promise<{ url: string } | { error: string }> {
  try {
    if (!R2_BUCKET_NAME || !R2_PUBLIC_URL) {
      return { error: "R2 storage belum dikonfigurasi." };
    }

    const ext = file.name.split(".").pop() ?? "bin";
    const key = `${folder}/${generateId()}.${ext}`;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        ContentLength: buffer.byteLength,
      })
    );

    return { url: `${R2_PUBLIC_URL}/${key}` };
  } catch (error) {
    console.error("R2 Upload Error:", error);
    return { error: "Gagal mengunggah file. Coba lagi." };
  }
}


