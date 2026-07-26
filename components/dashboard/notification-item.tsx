"tsx";
import Link from "next/link";
import { Users, Calendar, CheckCircle2, TrendingUp, Award, ShieldAlert, Bell } from "lucide-react";
import { NotificationItem, NotificationType } from "@/types/notification";

interface NotificationCardProps {
  notification: NotificationItem;
  onRead: (id: string) => void;
}

export function NotificationCard({ notification, onRead }: NotificationCardProps) {
  // Pemetaan ikon & warna berdasarkan jenis notifikasi
  const getIconAndColor = (type: NotificationType) => {
    switch (type) {
      case "lead_new":
        return { icon: Users, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" };
      case "survey_new":
        return {
          icon: Calendar,
          color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        };
      case "property_sold":
        return { icon: CheckCircle2, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
      case "property_price_changed":
        return { icon: TrendingUp, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" };
      case "membership_upgrade":
        return { icon: Award, color: "text-pink-400 bg-pink-500/10 border-pink-500/20" };
      case "admin_login":
        return {
          icon: ShieldAlert,
          color: "text-orange-400 bg-orange-500/10 border-orange-500/20",
        };
      default:
        return { icon: Bell, color: "text-slate-400 bg-slate-500/10 border-slate-500/20" };
    }
  };

  const { icon: Icon, color } = getIconAndColor(notification.type);

  const content = (
    <div
      onClick={() => !notification.is_read && onRead(notification.id)}
      className={`flex cursor-pointer items-start gap-3 border-b border-slate-800/60 p-3.5 transition-colors last:border-0 hover:bg-slate-800/40 ${
        !notification.is_read ? "bg-slate-900/60" : "bg-transparent opacity-75"
      }`}
    >
      <div className={`shrink-0 rounded-xl border p-2.5 ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h4 className="truncate text-xs font-bold text-white">{notification.title}</h4>
          {!notification.is_read && (
            <span className="h-2 w-2 shrink-0 rounded-full bg-amber-500"></span>
          )}
        </div>
        <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-slate-300">
          {notification.message}
        </p>
        <span className="mt-1.5 block text-[10px] text-slate-400">
          {new Date(notification.created_at).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          - {new Date(notification.created_at).toLocaleDateString("id-ID")}
        </span>
      </div>
    </div>
  );

  if (notification.link) {
    return <Link href={notification.link}>{content}</Link>;
  }

  return content;
}
