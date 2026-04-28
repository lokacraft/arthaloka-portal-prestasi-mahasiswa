"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Trash2, CheckCircle2, XCircle, AlertCircle, Bell, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getNotifications, markAllAsRead, markAsRead } from '@/server/notification-actions';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

export function NotifikasiContent() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    const res = await getNotifications();
    if (res?.success && res.data) {
      setNotifications(res.data);
      setUnreadCount(res.data.filter((n: any) => !n.isRead).length);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    fetchNotifications();
  };

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
      case "SUCCESS": return <CheckCircle2 className="h-6 w-6 text-[#50c878]" />;
      case "ERROR": return <XCircle className="h-6 w-6 text-red-500" />;
      case "WARNING": return <AlertCircle className="h-6 w-6 text-amber-500" />;
      default: return <Bell className="h-6 w-6 text-blue-500" />;
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-8 font-sans animate-in fade-in duration-500">
      <div>
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-[#50c878] hover:text-[#006400] font-medium text-[15px] transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" />Kembali
        </button>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold text-[#1a1a1a] tracking-tight">Notifikasi</h1>
            <p className="text-gray-500 text-[15px] mt-1">{unreadCount} notifikasi belum dibaca</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {unreadCount > 0 && (
              <Button onClick={handleMarkAllAsRead} variant="outline" className="h-10 px-4 rounded-xl text-[14px] font-medium text-[#50c878] border-emerald-200 hover:bg-emerald-50">
                <Check className="h-4 w-4 mr-2" />Tandai Semua Dibaca
              </Button>
            )}
            <Button variant="outline" className="h-10 px-4 rounded-xl text-[14px] font-medium text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100">
              <Trash2 className="h-4 w-4 mr-2" />Hapus yang Dibaca
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex gap-3">
          <button className="px-5 py-2 rounded-lg bg-[#50c878] text-white text-[14px] font-semibold">Semua (5)</button>
          <button className="px-5 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 text-[14px] font-semibold">Belum Dibaca (2)</button>
        </div>

        <div className="flex flex-col divide-y divide-gray-100">
          {notifications.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Bell className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Belum Ada Notifikasi</h3>
              <p>Anda belum memiliki notifikasi apapun saat ini.</p>
            </div>
          ) : (
            notifications.map((notif: any) => (
              <div 
                key={notif.id} 
                onClick={() => handleNotificationClick(notif)}
                className={`flex gap-4 p-6 hover:bg-gray-50/50 transition-colors relative group cursor-pointer ${!notif.isRead ? 'bg-gray-50/50' : ''}`}
              >
                {!notif.isRead && <div className={`absolute top-8 left-0 w-1 h-12 bg-[#50c878] rounded-r-full hidden md:block`}></div>}
                <div className={`h-12 w-12 rounded-full ${!notif.isRead ? 'bg-[#eafaf1]' : 'bg-gray-50'} flex items-center justify-center flex-shrink-0`}>
                  {getIconForType(notif.type)}
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="text-[15px] font-semibold text-gray-900 flex items-center gap-2">
                        {notif.title}
                        {!notif.isRead && <span className="w-2 h-2 rounded-full bg-[#50c878] shrink-0"></span>}
                      </h4>
                      <p className="text-[14px] text-gray-600 mt-1">{notif.message}</p>
                      <span className="text-[13px] text-gray-400 mt-2 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5"/> 
                        {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: localeId })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
