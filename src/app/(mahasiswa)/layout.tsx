export const dynamic = 'force-dynamic';

import React from "react";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Topbar } from "@/components/topbar";
import { getCurrentUser } from "@/server/user-actions";

export default async function MahasiswaLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <SidebarProvider>
      <AppSidebar role="mahasiswa" />
      <SidebarInset className="bg-gray-50 flex flex-col min-h-screen">
        <Topbar userName={user.name} userEmail={user.email} userId={user.nim} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
