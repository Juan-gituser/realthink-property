"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Building2, FileText, UserCheck, ArrowUpRight } from "lucide-react";

const actions = [
  {
    title: "Tambah Property",
    desc: "Input listing properti baru ke database",
    href: "/dashboard/admin/properties/create",
    icon: Building2,
    color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30",
  },
  {
    title: "Kelola Property",
    desc: "Update status, harga, atau hapus listing",
    href: "/dashboard/admin/properties",
    icon: Building2,
    color: "from-blue-500/25 to-indigo-500/20 text-blue-400 border-blue-500/30",
  },
  {
    title: "Tambah Artikel",
    desc: "Publikasikan wawasan & berita properti",
    href: "/dashboard/admin/articles/create",
    icon: FileText,
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    title: "Kelola Lead",
    desc: "Verifikasi kontak & atur jadwal klien",
    href: "/dashboard/admin/leads",
    icon: UserCheck,
    color: "from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30",
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {actions.map((action, idx) => {
        const Icon = action.icon;
        return (
          <motion.div key={idx} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
            <Link
              href={action.href}
              className="group flex h-full flex-col justify-between rounded-3xl border border-slate-800 bg-[#1C2541]/50 p-5 transition-all hover:border-slate-700"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className={`rounded-2xl border bg-linear-to-br p-3 ${action.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800/50 text-slate-400 transition-all group-hover:bg-amber-500 group-hover:text-slate-950">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white transition-colors group-hover:text-amber-400">
                  {action.title}
                </h4>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{action.desc}</p>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
