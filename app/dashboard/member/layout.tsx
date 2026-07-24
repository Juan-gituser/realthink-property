import Link from "next/link";
import { 
  LayoutDashboard, Heart, Calendar, Calculator, 
  MessageSquare, History, FileText, User, Shield, Bell, LogOut 
} from "lucide-react";

const navigationItems = [
  { name: "Dashboard", href: "/dashboard/member", icon: LayoutDashboard },
  { name: "Favorite", href: "/dashboard/member/favorite", icon: Heart },
  { name: "Riwayat Survey", href: "/dashboard/member/survey", icon: Calendar },
  { name: "Riwayat Kalkulator", href: "/dashboard/member/calculator", icon: Calculator },
  { name: "Riwayat Konsultasi", href: "/dashboard/member/consultation", icon: MessageSquare },
  { name: "Recently Viewed", href: "/dashboard/member/history", icon: History },
  { name: "Catatan Property", href: "/dashboard/member/notes", icon: FileText },
  { name: "Profile", href: "/dashboard/member/profile", icon: User },
  { name: "Security", href: "/dashboard/member/security", icon: Shield },
  { name: "Notification", href: "/dashboard/member/notification", icon: Bell },
];

export default function MemberDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Navigasi */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">Member Area</span>
          <h2 className="text-lg font-bold font-heading text-slate-900">Realthink Property</h2>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <Icon className="w-4 h-4 text-slate-400" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <form action="/auth/signout" method="POST">
            <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </form>
        </div>
      </aside>

      {/* Konten Utama Dashboard */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}