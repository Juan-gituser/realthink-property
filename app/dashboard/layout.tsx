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
  Tag,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Helper untuk format nama label role di sidebar bottom
const getRoleLabel = (role: string) => {
  switch (role) {
    case "admin":
      return "Administrator";
    case "smart_buyer":
    case "smart-buyer":
      return "Smart Buyer";
    case "member":
    default:
      return "Member";
  }
};

// Helper untuk menentukan konfigurasi navigasi berdasarkan role
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
        ],
      };

    // Role Terpisah: Smart Buyer
    case "smart_buyer":
    case "smart-buyer":
      return {
        dashboardName: "Smart Buyer Center",
        dashboardPath: "/dashboard/smart-buyer",
        navItems: [
          { name: "Favorit Saya", path: "/dashboard/smart-buyer/favorite", icon: Heart },
          { name: "Jadwal Survey", path: "/dashboard/smart-buyer/survey", icon: Calendar },
          { name: "Kalkulator KPR", path: "/dashboard/smart-buyer/calculator", icon: Calculator },
          {
            name: "Konsultasi Prioritas",
            path: "/dashboard/smart-buyer/consultation",
            icon: MessageSquare,
          },
          { name: "Riwayat Penawaran", path: "/dashboard/smart-buyer/history", icon: Clock },
          { name: "Notifikasi", path: "/dashboard/smart-buyer/notification", icon: Bell },
          { name: "Profil Saya", path: "/dashboard/smart-buyer/profile", icon: User },
          { name: "Keamanan Akun", path: "/dashboard/smart-buyer/security", icon: Shield },
        ],
      };

    // Role Default: Member
    case "member":
    default:
      return {
        dashboardName: "Member Center",
        dashboardPath: "/dashboard/member",
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
        ],
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
        className="bg-card border-border text-foreground hover:border-secondary relative flex cursor-pointer items-center justify-center rounded-2xl border p-2.5 shadow-xs transition-all"
        aria-label="Buka Notifikasi"
      >
        <Bell className="h-4 w-4" />
        <span className="bg-secondary ring-card absolute top-2 right-2 h-2 w-2 animate-pulse rounded-full ring-2" />
      </button>

      {isOpen && (
        <div className="bg-card border-border absolute right-0 z-50 mt-3 w-80 overflow-hidden rounded-3xl border shadow-2xl shadow-black/30 sm:w-96">
          <div className="border-border/60 bg-muted/30 flex items-center justify-between border-b px-5 py-4">
            <div className="flex items-center gap-2">
              <h3 className="font-heading text-foreground text-xs font-bold tracking-wider uppercase">
                Notifikasi
              </h3>
              <span className="bg-secondary/15 text-secondary rounded-full px-2 py-0.5 text-[10px] font-semibold">
                Baru
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground cursor-pointer text-[11px] transition"
            >
              Tandai semua dibaca
            </button>
          </div>

          <div className="divide-border/40 max-h-80 divide-y overflow-y-auto">
            <div className="hover:bg-muted/50 flex items-start gap-3.5 p-4 transition">
              <div className="bg-secondary/10 text-secondary mt-0.5 shrink-0 rounded-xl p-2">
                <Info className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <p className="text-foreground text-xs font-bold">Pembaruan Sistem Dashboard</p>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  Navigasi modular dinamis berdasarkan role aktif digunakan.
                </p>
                <span className="text-muted-foreground/70 block pt-1 text-[10px]">Baru saja</span>
              </div>
            </div>
          </div>

          <div className="bg-muted/20 border-border/60 border-t p-3 text-center">
            <span className="text-muted-foreground text-[11px] font-medium">
              Realthink Property Notification Center
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<string>("member");
  const supabase = createClient();

  useEffect(() => {
    async function fetchUserRole() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        const role = profile?.role || user.user_metadata?.role || "member";
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
    <QueryClientProvider client={queryClient}>
      <div className="bg-background text-foreground flex h-screen w-full overflow-hidden font-sans antialiased">
        {sidebarOpen && (
          <div
            className="bg-primary/40 fixed inset-0 z-40 backdrop-blur-xs lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`bg-card border-border fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col justify-between overflow-y-auto border-r p-6 transition-transform duration-300 ease-in-out lg:static ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} `}
        >
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2.5">
              <Building2 className="text-secondary h-7 w-7 shrink-0" />
              <span className="font-heading text-primary text-lg font-bold tracking-tight whitespace-nowrap">
                Realthink <span className="text-secondary">Property</span>
              </span>
            </Link>

            <Link
              href="/"
              onClick={() => setSidebarOpen(false)}
              className="bg-secondary/10 text-secondary border-secondary/30 hover:bg-secondary/20 flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-xs font-semibold shadow-xs transition-all"
            >
              <Home className="text-secondary h-4 w-4 shrink-0" />
              <span>Kembali ke Beranda</span>
            </Link>

            <nav className="space-y-1.5 pt-2">
              <p className="text-muted-foreground mb-2 px-3 text-[10px] font-bold tracking-wider uppercase">
                Menu Utama
              </p>

              <Link
                href={dashboardPath}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-xs font-semibold transition-all ${
                  isDashboardActive
                    ? "bg-primary text-primary-foreground shadow-primary/10 shadow-md"
                    : "text-foreground hover:bg-muted hover:text-primary"
                }`}
              >
                <LayoutDashboard
                  className={`h-4 w-4 ${isDashboardActive ? "text-secondary" : "text-muted-foreground"}`}
                />
                <span>{dashboardName}</span>
              </Link>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-primary/10 shadow-md"
                        : "text-foreground hover:bg-muted hover:text-primary"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${isActive ? "text-secondary" : "text-muted-foreground"}`}
                    />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="border-border mt-6 space-y-3 border-t pt-4">
            <div className="flex items-center gap-3 px-2">
              <div className="bg-secondary/15 border-secondary/30 text-secondary flex h-9 w-9 items-center justify-center rounded-full border text-xs font-bold">
                <UserCheck className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-foreground truncate text-xs font-bold">Akun Terhubung</p>
                <p className="text-secondary truncate text-[10px] font-medium capitalize">
                  {getRoleLabel(userRole)}
                </p>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="text-destructive hover:bg-destructive/10 flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition"
            >
              <LogOut className="h-4 w-4" />
              <span>Keluar Sesi</span>
            </button>
          </div>
        </aside>

        <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
          <header className="bg-card border-border sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hover:bg-muted text-foreground cursor-pointer rounded-lg p-2 lg:hidden"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <h1 className="font-heading text-primary text-sm font-bold sm:text-base">
                Panel Kendali
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <NotificationDropdown />
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6 sm:p-8">{children}</main>
        </div>
      </div>
    </QueryClientProvider>
  );
}
