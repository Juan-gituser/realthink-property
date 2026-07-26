"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

export default function WishlistButton({ propertyId }: { propertyId: string }) {
  // Menggunakan Lazy Initial State untuk membaca localStorage secara aman tanpa useEffect
  const [isWishlisted, setIsWishlisted] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const wishlist: string[] = JSON.parse(
        localStorage.getItem("realthink_wishlist") || "[]"
      );
      return wishlist.includes(propertyId);
    } catch {
      return false;
    }
  });

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault(); // Mencegah trigger link card
    const wishlist: string[] = JSON.parse(
      localStorage.getItem("realthink_wishlist") || "[]"
    );

    let updatedWishlist;
    if (isWishlisted) {
      updatedWishlist = wishlist.filter((id) => id !== propertyId);
    } else {
      if (wishlist.length >= 20) {
        alert("Maksimal 20 properti dalam wishlist.");
        return;
      }
      updatedWishlist = [...wishlist, propertyId];
    }

    localStorage.setItem("realthink_wishlist", JSON.stringify(updatedWishlist));
    setIsWishlisted(!isWishlisted);
  };

  return (
    <button
      onClick={toggleWishlist}
      className="group rounded-full bg-white/90 p-2.5 text-gray-700 shadow-md backdrop-blur-sm transition hover:bg-white"
      title="Simpan ke Favorit"
    >
      <Heart
        className={`h-4 w-4 transition ${
          isWishlisted
            ? "fill-rose-500 text-rose-500"
            : "text-gray-600 group-hover:text-rose-500"
        }`}
      />
    </button>
  );
}