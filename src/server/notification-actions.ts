"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

/**
 * Get all notifications for the currently logged in user
 */
export async function getNotifications() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return { error: "Unauthorized" };

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: notifications };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return { error: "Gagal mengambil notifikasi." };
  }
}

/**
 * Mark a single notification as read
 */
export async function markAsRead(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return { error: "Unauthorized" };

  try {
    const notif = await prisma.notification.findUnique({ where: { id } });
    if (!notif || notif.userId !== session.user.id) {
      return { error: "Not found or unauthorized" };
    }

    await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return { success: true };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { error: "Gagal menandai notifikasi." };
  }
}

/**
 * Mark all notifications as read for the logged in user
 */
export async function markAllAsRead() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return { error: "Unauthorized" };

  try {
    await prisma.notification.updateMany({
      where: { userId: session.user.id, isRead: false },
      data: { isRead: true },
    });

    return { success: true };
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return { error: "Gagal menandai semua notifikasi." };
  }
}

/**
 * Get unread notifications count
 */
export async function getUnreadCount() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return { error: "Unauthorized" };

  try {
    const count = await prisma.notification.count({
      where: { userId: session.user.id, isRead: false },
    });

    return { success: true, count };
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return { error: "Gagal mengambil jumlah notifikasi." };
  }
}
