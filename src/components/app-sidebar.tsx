"use client";

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { LogOut } from "lucide-react"
import { toast } from "sonner"
import { logoutAction } from "@/server/auth-actions"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { navigationConfig } from "@/config/navigation"

export function AppSidebar({ role, ...props }: React.ComponentProps<typeof Sidebar> & { role: keyof typeof navigationConfig }) {
  const pathname = usePathname();
  const router = useRouter();
  const navItems = navigationConfig[role];

  const handleLogout = async () => {
    try {
      toast.loading("Memproses proses keluar...", { id: "logout-toast" });
      const res = await logoutAction();
      
      if (res.error) {
        toast.error(res.error, { id: "logout-toast" });
      } else {
        toast.success("Berhasil keluar dari sistem.", { id: "logout-toast" });
        router.push("/sign-in");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem.", { id: "logout-toast" });
    }
  };

  return (
    <Sidebar {...props} className="border-r border-gray-100 bg-white">
      <SidebarHeader className="pt-8 pb-6 px-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-[#50C878]">Portal Data<br/>Prestasi</h2>
          <span className="text-sm font-medium text-gray-500">S1 Teknik Industri</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {navItems.map((item) => {
                // Determine active state with simple startsWith logic or exact match
                const isActive = pathname === item.url || (item.url !== "/" && pathname.startsWith(item.url));
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      // @ts-expect-error asChild is valid for Slot
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={`h-11 px-4 text-base transition-colors ${
                        isActive 
                          ? "!bg-[#50C878] !text-white hover:!bg-[#43B569]" 
                          : "text-gray-700 hover:bg-emerald-50 hover:text-[#50C878]"
                      }`}
                    >
                      <Link href={item.url}>
                        <item.icon className="h-5 w-5 mr-3 shrink-0" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 mt-auto mb-8">
        <SidebarMenu>
          <SidebarMenuItem>
            <AlertDialog>
              {/* @ts-expect-error asChild is valid for Slot */}
              <AlertDialogTrigger asChild>
                <SidebarMenuButton 
                  className="h-11 px-4 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <LogOut className="h-5 w-5 mr-3 shrink-0" />
                  <span className="font-medium">Logout</span>
                </SidebarMenuButton>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Konfirmasi Keluar</AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah Anda yakin ingin keluar dari portal? Anda harus memasukkan kredensial kembali untuk mengakses sistem.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white">
                    Ya, Keluar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
