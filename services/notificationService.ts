import { createClient } from "@/lib/supabase/client";
import { NotificationItem } from "@/types/notification";

/**
 * Mengambil daftar 20 notifikasi terbaru dari Supabase
 */
export async function fetchNotifications(): Promise<NotificationItem[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    throw new Error(`Gagal memuat notifikasi: ${error.message}`);
  }

  return data || [];
}

/**
 * Memperbarui status satu notifikasi menjadi sudah dibaca (is_read: true)
 */
export async function markAsRead(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id);

  if (error) {
    throw new Error(`Gagal memperbarui status notifikasi: ${error.message}`);
  }
}

/**
 * Memperbarui semua notifikasi yang belum dibaca menjadi sudah dibaca
 */
export async function markAllAsRead(): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("is_read", false);

  if (error) {
    throw new Error(`Gagal memperbarui semua notifikasi: ${error.message}`);
  }
}