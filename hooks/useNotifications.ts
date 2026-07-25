"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { fetchNotifications, markAsRead, markAllAsRead } from "@/services/notificationService";
import { NotificationItem } from "@/types/notification";

export function useNotifications() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  // Fetch data awal menggunakan React Query
  const { data: notifications = [], isLoading, error } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    staleTime: 1000 * 60 * 2, // Cache selama 2 menit
  });

  /**
   * Mengatur langganan Supabase Realtime (Websocket)
   * Kompleksitas: Menangkap event INSERT baru dan memasukkannya ke state React Query secara instan.
   */
  useEffect(() => {
    const channel = supabase
      .channel("public:notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          const newNotification = payload.new as NotificationItem;
          // Optimistically update React Query cache dengan data baru dari Realtime
          queryClient.setQueryData(["notifications"], (old: NotificationItem[] = []) => [
            newNotification,
            ...old,
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, supabase]);

  // Mutasi untuk menandai satu notifikasi dibaca
  const markAsReadMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: (_, id) => {
      queryClient.setQueryData(["notifications"], (old: NotificationItem[] = []) =>
        old.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    },
  });

  // Mutasi untuk menandai semua dibaca
  const markAllAsReadMutation = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.setQueryData(["notifications"], (old: NotificationItem[] = []) =>
        old.map((n) => ({ ...n, is_read: true }))
      );
    },
  });

  // Hitung jumlah pesan yang belum dibaca
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
  };
}