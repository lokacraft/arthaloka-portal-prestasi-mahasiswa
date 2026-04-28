"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, User, ChevronDown, Settings, LogOut, CheckCircle2, XCircle, AlertCircle, Clock } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { toast } from "sonner";
import { logoutAction } from "@/server/auth-actions";
import { useSession } from "@/lib/auth-client";
import { getNotifications, markAsRead } from "@/server/notification-actions";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";

interface TopbarProps {
  userName?: string;
  userEmail?: string;
}

export function Topbar({ userName: defaultName = "Ahmad Rizki", userEmail: defaultEmail = "user@example.com" }: TopbarProps) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const { data: session } = useSession();
  
  const user = session?.user;
  const userName = user?.name || defaultName;
  const userEmail = user?.email || defaultEmail;
  const userImage = user?.image;

  // Determine basePath dynamically based on role prefix (e.g., /admin, /akreditasi). 
  // If no known prefix, default to "" (mahasiswa role)
  const rolePrefixes = ["/admin", "/akreditasi", "/wd1"];
  const basePath = rolePrefixes.find(prefix => pathname.startsWith(prefix)) || "";

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

  const showNotifications = basePath === "" || basePath === "/admin";
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!showNotifications) return;
    const res = await getNotifications();
    if (res?.success && res.data) {
      setNotifications(res.data);
      setUnreadCount(res.data.filter((n: any) => !n.isRead).length);
    }
  }, [showNotifications]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleNotificationClick = async (notif: any) => {
    if (!notif.isRead) {
      await markAsRead(notif.id);
      fetchNotifications();
    }
    if (notif.linkUrl) {
      router.push(notif.linkUrl);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "SUCCESS": return <CheckCircle2 className="h-5 w-5 text-[#50c878]" />;
      case "ERROR": return <XCircle className="h-5 w-5 text-red-500" />;
      case "WARNING": return <AlertCircle className="h-5 w-5 text-amber-500" />;
      default: return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b px-6 bg-white sticky top-0 z-10 w-full shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-2 text-gray-500 hover:text-[#50C878] hover:bg-emerald-50 transition-colors" />
      </div>

      <div className="flex items-center gap-6">
        
        {/* Notifications Popover */}
        {showNotifications && (
          <Popover>
            <PopoverTrigger className="relative text-gray-600 hover:text-[#50C878] transition-colors outline-none focus:outline-none">
              <Bell className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white flex items-center justify-center text-[10px] font-bold rounded-full border-2 border-white">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[380px] p-0 mt-2 border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.08)] bg-white rounded-xl">
              <div className="flex items-center justify-between p-4 border-b border-gray-100/60 bg-white rounded-t-xl">
                <h3 className="font-semibold text-[15px] text-gray-900">Notifikasi</h3>
                <span className="text-[13px] text-gray-500 font-medium">{unreadCount} belum dibaca</span>
              </div>
              
              <div className="flex flex-col max-h-[340px] overflow-y-auto bg-white">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-500 text-sm">Tidak ada notifikasi</div>
                ) : (
                  notifications.slice(0, 5).map((notif) => (
                    <div 
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`flex gap-3 p-4 border-b border-gray-50 hover:bg-gray-50/80 cursor-pointer transition-colors relative ${!notif.isRead ? 'bg-gray-50/30' : ''}`}
                    >
                      {!notif.isRead && <div className="absolute top-5 right-4 w-2 h-2 rounded-full bg-[#50c878]"></div>}
                      <div className="mt-0.5">{getIconForType(notif.type)}</div>
                      <div className="flex flex-col pr-4">
                        <span className={`text-[14px] ${!notif.isRead ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'} select-none`}>{notif.title}</span>
                        <span className="text-[13px] text-gray-600 mt-0.5 select-none line-clamp-2">{notif.message}</span>
                        <span className="text-[12px] text-gray-400 mt-1.5 flex items-center gap-1 select-none">
                          <Clock className="h-[14px] w-[14px]"/> 
                          {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: localeId })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-3.5 border-t border-gray-100 flex items-center justify-center bg-gray-50/30 rounded-b-xl">
                <Link href={`${basePath}/notifikasi`} className="text-[13.5px] font-semibold text-[#50c878] hover:text-[#006400] transition-colors cursor-pointer select-none">
                  Lihat Semua Notifikasi
                </Link>
              </div>
            </PopoverContent>
          </Popover>
        )}

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none outline-none group data-[state=open]:opacity-80 transition-opacity">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="hidden md:flex flex-col text-right justify-center max-w-[150px]">
                <span className="text-[14px] font-semibold text-gray-900 leading-tight group-hover:text-[#50c878] transition-colors truncate">{userName}</span>
                <span className="text-[12px] text-gray-500 leading-tight mt-0.5 truncate">{userEmail}</span>
              </div>
              <Avatar size="lg" className="bg-[#50C878] border border-emerald-100 flex-shrink-0 shadow-sm overflow-hidden">
                {userImage && <AvatarImage src={userImage} alt={userName} className="object-cover" />}
                <AvatarFallback className="bg-[#50C878] text-white">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </div>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-[220px] p-1.5 mt-2 bg-white rounded-xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
            <div className="flex flex-col px-3 py-2.5 mb-1.5 bg-gray-50/50 rounded-lg overflow-hidden">
              <span className="text-[14px] font-semibold text-gray-900 truncate">{userName}</span>
              <span className="text-[12px] text-gray-500 truncate mt-0.5">{userEmail}</span>
            </div>
            
            <DropdownMenuItem
              asChild
              className="cursor-pointer py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors group/item outline-none flex items-center"
            >
              <Link href={`${basePath}/pengaturan`}>
                <Settings className="h-[18px] w-[18px] mr-2.5 text-gray-500" />
                <span className="font-medium text-[14px] text-gray-700">Pengaturan Akun</span>
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="my-1.5 bg-gray-100" />
            
            <DropdownMenuItem 
              onClick={handleLogout}
              className="cursor-pointer py-2.5 px-3 rounded-lg hover:bg-red-50 focus:bg-red-50 group/logout outline-none flex items-center"
            >
              <LogOut className="h-[18px] w-[18px] mr-2.5 text-red-500 group-hover/logout:text-red-600 transition-colors" />
              <span className="font-medium text-[14px] text-red-600">Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
