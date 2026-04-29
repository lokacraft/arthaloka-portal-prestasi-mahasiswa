import React from 'react';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Topbar } from "@/components/topbar";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function Wd1Layout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  // Check if user has WD role
  const userWithRoles = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      userRoles: {
        include: {
          role: true,
        },
      },
    },
  });

  const isWD = userWithRoles?.userRoles.some(
    (ur) => ur.role.name.toUpperCase() === "WD" || ur.role.name.toUpperCase() === "ADMIN"
  );

  if (!isWD) {
    // If not WD, redirect to general dashboard
    redirect("/dashboard");
  }

  return (
    <SidebarProvider>
      <AppSidebar role="wd1" />
      <SidebarInset className="bg-gray-50 flex flex-col min-h-screen">
        <Topbar userName={session.user.name} userEmail={session.user.email} userId={session.user.id} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
