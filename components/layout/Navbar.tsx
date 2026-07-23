"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Properti", href: "/listing" },
    { name: "Artikel", href: "/artikel" },
    { name: "Tentang Kami", href: "/tentang-kami" },
  ];

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-border shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo Area */}
        <Link href="/" className="flex items-center gap-2 group">
          {/* Ganti dengan Logo Image Nanti */}
          <Building2 className="w-8 h-8 text-secondary group-hover:text-primary transition-colors" />
          <span className="font-heading font-bold text-xl text-primary">
            Realthink <span className="text-secondary">Property</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-foreground hover:text-secondary font-medium transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* CTA Desktop */}
        <div className="hidden md:block">
          <Link
            href="/dashboard"
            className="bg-primary text-white px-6 py-2.5 rounded-md font-medium hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
          >
            Titip Properti
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-border py-4 shadow-lg"
          >
            <div className="container mx-auto px-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-foreground hover:text-secondary font-medium py-2 border-b border-border/50"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/dashboard"
                className="bg-primary text-white text-center px-6 py-3 mt-2 rounded-md font-medium"
              >
                Titip Properti
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}