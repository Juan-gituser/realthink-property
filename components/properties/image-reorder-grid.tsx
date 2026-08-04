"use client";

import { useState } from "react";
import { Reorder } from "framer-motion";
import { GripVertical, Trash2, ArrowLeft, ArrowRight, Star } from "lucide-react";

export interface ImageItem {
  id: string;
  url: string;
}

interface ImageReorderGridProps {
  images: ImageItem[];
  onChange: (newImages: ImageItem[]) => void;
  onRemove?: (id: string) => void;
}

export function ImageReorderGrid({
  images,
  onChange,
  onRemove,
}: ImageReorderGridProps) {
  // Fungsi untuk memindahkan urutan secara manual (opsional/alternatif drag)
  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    const updated = [...images];
    const [movedItem] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, movedItem);
    onChange(updated);
  };

  if (!images || images.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center text-xs text-gray-400">
        Belum ada foto yang diunggah.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-gray-500">
          💡 **Geser (Drag & Drop)** baris foto untuk menyusun ulang. Foto teratas otomatis menjadi **Cover Utama**.
        </p>
        <span className="text-xs font-bold text-gray-400">
          Total: {images.length} Foto
        </span>
      </div>

      <Reorder.Group
        axis="y"
        values={images}
        onReorder={onChange}
        className="space-y-2.5"
      >
        {images.map((item, index) => (
          <Reorder.Item
            key={item.id}
            value={item}
            className="group relative flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-3 shadow-xs transition hover:border-amber-400 hover:shadow-sm select-none"
          >
            {/* Drag Handle & Info Utama */}
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="cursor-grab active:cursor-grabbing p-1 text-gray-300 transition group-hover:text-amber-500"
                title="Geser posisi"
              >
                <GripVertical className="h-5 w-5" />
              </div>

              {/* Thumbnail Image */}
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                <img
                  src={item.url}
                  alt={`Preview ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                {index === 0 && (
                  <div className="absolute top-1 left-1 rounded-md bg-amber-500 p-1 text-white shadow-xs">
                    <Star className="h-3 w-3 fill-current" />
                  </div>
                )}
              </div>

              {/* Title / Status */}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-gray-900 truncate">
                    {index === 0 ? "Foto Utama (Cover)" : `Foto #${index + 1}`}
                  </p>
                  {index === 0 && (
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600 border border-amber-200">
                      Cover
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-[10px] text-gray-400 truncate max-w-50[200px] sm:max-w-xs">
                  {item.url}
                </p>
              </div>
            </div>

            {/* Aksi Navigasi & Hapus */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Tombol Panah Manual */}
              <div className="flex items-center rounded-lg border border-gray-100 bg-gray-50 p-0.5">
                <button
                  type="button"
                  onClick={() => moveImage(index, index - 1)}
                  disabled={index === 0}
                  className="p-1.5 text-gray-400 transition hover:text-gray-700 disabled:opacity-20 disabled:cursor-not-allowed"
                  title="Pindah ke Atas"
                >
                  <ArrowLeft className="h-3.5 w-3.5 rotate-90" />
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(index, index + 1)}
                  disabled={index === images.length - 1}
                  className="p-1.5 text-gray-400 transition hover:text-gray-700 disabled:opacity-20 disabled:cursor-not-allowed"
                  title="Pindah ke Bawah"
                >
                  <ArrowRight className="h-3.5 w-3.5 rotate-90" />
                </button>
              </div>

              {/* Tombol Hapus */}
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className="rounded-xl p-2 text-rose-500 transition hover:bg-rose-50"
                  title="Hapus Foto"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}