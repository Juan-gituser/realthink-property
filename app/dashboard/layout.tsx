"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Building2, 
  LayoutDashboard, 
  Settings, 
  Users, 
  Heart,
  Calendar,
  Calculator,
  MessageSquare,
  Clock,
  FileText,
  Bell,
  User,
  Shield,
  LogOut, 
  Menu, 
  X,
  UserCheck,
  Info,
  Home,
  BarChart3,
  Tag
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// Fungsi helper untuk menentukan menu berdasarkan role pengguna (disesuaikan dengan folder /dashboard/admin)
const getNavConfig = (role: string) => {
  switch (role) {
    case "admin":
      return {
        dashboardName: "Overview Admin",
        dashboardPath: "/dashboard/admin",
        navItems: [
          { name: "Analitik", path: "/dashboard/admin/analytics", icon: BarChart3 },
          { name: "Kelola Pengguna", path: "/dashboard/admin/users", icon: Users },
          { name: "Manajemen Properti", path: "/dashboard/admin/properties", icon: Building2 },
          { name: "Pricing", path: "/dashboard/admin/pricing", icon: Tag },
          { name: "Pengaturan Sistem", path: "/dashboard/admin/settings", icon: Settings },
        ]
      };
    case "smart_buyer":
    default:
      return {
        dashboardName: "Smart Buyer Center",
        dashboardPath: "/dashboard/smart-buyer",
        navItems: [
          { name: "Favorit", path: "/dashboard/member/favorite", icon: Heart },
          { name: "Survey", path: "/dashboard/member/survey", icon: Calendar },
          { name: "Kalkulator", path: "/dashboard/member/calculator", icon: Calculator },
          { name: "Konsultasi", path: "/dashboard/member/consultation", icon: MessageSquare },
          { name: "Riwayat", path: "/dashboard/member/history", icon: Clock },
          { name: "Catatan", path: "/dashboard/member/notes", icon: FileText },
          { name: "Notifikasi", path: "/dashboard/member/notification", icon: Bell },
          { name: "Profil", path: "/dashboard/member/profile", icon: User },
          { name: "Keamanan", path: "/dashboard/member/security", icon: Shield },
        ]
      };
  }
};

function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-2xl bg-card border border-border text-foreground hover:border-secondary transition-all cursor-pointer flex items-center justify-center shadow-xs"
        aria-label="Buka Notifikasi"
      >
        <Bell className="w-4 h-4" />
        <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full ring-2 ring-card animate-pulse" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-card border border-border rounded-3xl shadow-2xl shadow-black/30 z-50 overflow-hidden">
          <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between bg-muted/30">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold font-heading uppercase tracking-wider text-foreground">
                Notifikasi
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-secondary/15 text-secondary text-[10px] font-semibold">
                Baru
              </span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-[11px] text-muted-foreground hover:text-foreground transition cursor-pointer"
            >
              Tandai semua dibaca
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-border/40">
            <div className="p-4 hover:bg-muted/50 transition flex gap-3.5 items-start">
              <div className="p-2 bg-secondary/10 text-secondary rounded-xl shrink-0 mt-0.5">
                <Info className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-foreground">
                  Pembaruan Sistem Dashboard
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Navigasi modular dinamis berdasarkan role aktif digunakan.
                </p>
                <span className="text-[10px] text-muted-foreground/70 block pt-1">
                  Baru saja
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-muted/20 border-t border-border/60 text-center">
            <span className="text-[11px] text-muted-foreground font-medium">
              Realthink Property Notification Center
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<string>("smart_buyer");
  const supabase = createClient();

  useEffect(() => {
    async function fetchUserRole() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Mengambil role dari metadata user atau set default
        const role = user.user_metadata?.role || "smart_buyer";
        setUserRole(role);
      }
    }
    fetchUserRole();
  }, [supabase]);

  const { dashboardName, dashboardPath, navItems } = getNavConfig(userRole);
  const isDashboardActive = pathname === dashboardPath;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="h-screen w-full bg-background text-foreground flex overflow-hidden font-sans antialiased">
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-primary/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border 
        flex flex-col justify-between p-6 transition-transform duration-300 ease-in-out shrink-0 overflow-y-auto
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Building2 className="w-7 h-7 text-secondary shrink-0" />
            <span className="font-heading font-bold text-lg text-primary tracking-tight whitespace-nowrap">
              Realthink <span className="text-secondary">Property</span>
            </span>
          </Link>

          {/* Tombol Kembali ke Beranda Utama Website */}
          <Link
            href="/"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-secondary/10 text-secondary border border-secondary/30 hover:bg-secondary/20 transition-all shadow-xs"
          >
            <Home className="w-4 h-4 text-secondary shrink-0" />
            <span>Kembali ke Beranda</span>
          </Link>

          {/* Menu Navigasi Utama (Dinamis Berdasarkan Role) */}
          <nav className="space-y-1.5 pt-2">
            <p className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Menu Utama
            </p>

            {/* Tombol Dashboard Utama Khusus Role */}
            <Link
              href={dashboardPath}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                isDashboardActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
                  : "text-foreground hover:bg-muted hover:text-primary"
              }`}
            >
              <LayoutDashboard className={`w-4 h-4 ${isDashboardActive ? "text-secondary" : "text-muted-foreground"}`} />
              <span>{dashboardName}</span>
            </Link>

            {/* Sisa Menu Sesuai Role */}
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
                      : "text-foreground hover:bg-muted hover:text-primary"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-secondary" : "text-muted-foreground"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-border space-y-3 mt-6">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-secondary/15 border border-secondary/30 flex items-center justify-center text-secondary font-bold text-xs">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-foreground truncate">Akun Terhubung</p>
              <p className="text-[10px] font-medium text-secondary capitalize truncate">
                {userRole.replace("_", " ")}
              </p>
            </div>
          </div>

          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-destructive hover:bg-destructive/10 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Sesi</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="h-16 shrink-0 bg-card border-b border-border px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted text-foreground cursor-pointer"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-sm sm:text-base font-bold font-heading text-primary">
              Panel Kendali
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <NotificationDropdown />
          </div>
        </header>

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}