"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { logoutAction } from "@/server/auth-actions";

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
} from "@/components/ui/alert-dialog";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { navigationConfig } from "@/config/navigation";
import { Separator } from "./ui/separator";

export function AppSidebar({
  role,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  role: keyof typeof navigationConfig;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const navItems = navigationConfig[role];
  const [openStates, setOpenStates] = React.useState<Record<string, boolean>>({});

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
          <h2 className="text-xl font-bold text-[#50C878]">
            Portal Data
            <br />
            Prestasi Fakultas Rekayasa Industri
          </h2>
          <span className="text-sm font-medium text-gray-500">
            S1 Teknik Industri
          </span>
        </div>
      </SidebarHeader>
      <Separator orientation="horizontal" />

      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.url ||
                  (item.url !== "/" &&
                    item.url !== "#" &&
                    pathname.startsWith(item.url));

                if (item.subItems && item.subItems.length > 0) {
                  const isSubActive = item.subItems.some(
                    (sub) =>
                      pathname === sub.url || pathname.startsWith(sub.url),
                  );
                  const isOpen = openStates[item.title] ?? isSubActive;

                  return (
                    <Collapsible
                      key={item.title}
                      open={isOpen}
                      onOpenChange={(val) => setOpenStates(prev => ({...prev, [item.title]: val}))}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger
                          render={
                            <SidebarMenuButton
                              tooltip={item.title}
                              className={`h-11 px-4 text-sm transition-colors ${
                                isSubActive
                                  ? "!bg-emerald-50 !text-[#50C878] font-semibold"
                                  : "text-gray-700 hover:bg-emerald-50 hover:text-[#50C878]"
                              }`}
                            >
                              <item.icon className="h-5 w-5 mr-3 shrink-0" />
                              <span className="font-medium">{item.title}</span>
                              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                            </SidebarMenuButton>
                          }
                        />
                        <CollapsibleContent>
                          <SidebarMenuSub className="mr-0 pr-0 pl-10 border-l border-emerald-100">
                            {item.subItems.map((subItem) => {
                              const isSubItemActive =
                                pathname === subItem.url ||
                                pathname.startsWith(subItem.url);
                              return (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton
                                    render={<Link href={subItem.url} />}
                                    isActive={isSubItemActive}
                                    className={`h-9 px-3 my-1 text-[13px] rounded-lg transition-colors ${
                                      isSubItemActive
                                        ? "!bg-[#50C878] !text-white hover:!bg-[#43B569] font-medium shadow-sm"
                                        : "text-gray-600 hover:bg-emerald-50 hover:text-[#50C878]"
                                    }`}
                                  >
                                    <span>{subItem.title}</span>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={<Link href={item.url} />}
                      isActive={isActive}
                      tooltip={item.title}
                      className={`h-11 px-4 text-sm transition-colors ${
                        isActive
                          ? "!bg-[#50C878] !text-white hover:!bg-[#43B569] shadow-sm"
                          : "text-gray-700 hover:bg-emerald-50 hover:text-[#50C878]"
                      }`}
                    >
                      <item.icon className="h-5 w-5 mr-3 shrink-0" />
                      <span className="font-medium">{item.title}</span>
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
              <AlertDialogTrigger
                render={
                  <SidebarMenuButton className="h-11 px-4 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer" />
                }
              >
                <LogOut className="h-5 w-5 mr-3 shrink-0" />
                <span className="font-medium">Logout</span>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Konfirmasi Keluar</AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah Anda yakin ingin keluar dari portal? Anda harus
                    memasukkan kredensial kembali untuk mengakses sistem.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    Ya, Keluar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
