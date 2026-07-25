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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, idx) => {
        const Icon = action.icon;
        return (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href={action.href}
              className="bg-[#1C2541]/50 border border-slate-800 hover:border-slate-700 p-5 rounded-3xl flex flex-col justify-between h-full group transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl border bg-linear-to-br ${action.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                  {action.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{action.desc}</p>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}