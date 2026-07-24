"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

export default function WishlistButton({ propertyId }: { propertyId: string }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const wishlist: string[] = JSON.parse(localStorage.getItem("realthink_wishlist") || "[]");
    setIsWishlisted(wishlist.includes(propertyId));
  }, [propertyId]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault(); // Mencegah trigger link card
    const wishlist: string[] = JSON.parse(localStorage.getItem("realthink_wishlist") || "[]");
    
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
      className="p-2.5 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-md transition backdrop-blur-sm group"
      title="Simpan ke Favorit"
    >
      <Heart className={`w-4 h-4 transition ${isWishlisted ? "fill-rose-500 text-rose-500" : "text-gray-600 group-hover:text-rose-500"}`} />
    </button>
  );
}