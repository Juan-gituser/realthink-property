"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

interface PropertyMapProps {
  lat?: number;
  latitude?: number;
  lng?: number;
  longitude?: number;
  address?: string;
  title?: string;
}

export default function PropertyMap({
  lat,
  latitude = -6.200000,
  lng,
  longitude = 106.816666,
  address,
  title,
}: PropertyMapProps) {
  // Mendukung nama prop 'lat'/'lng' maupun 'latitude'/'longitude'
  const finalLat = lat ?? latitude;
  const finalLng = lng ?? longitude;

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<ReturnType<typeof import("leaflet").map> | null>(null);

  useEffect(() => {
    // Pastikan kode hanya berjalan di browser
    if (typeof window === "undefined" || !mapRef.current) return;

    // Load Leaflet secara dinamis untuk menghindari error SSR (window is not defined)
    import("leaflet").then((L) => {
      // Bersihkan instance lama jika koordinat/data berubah
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Inisialisasi Peta
      const map = L.map(mapRef.current!).setView([finalLat, finalLng], 15);
      mapInstanceRef.current = map;

      // Layer OpenStreetMap
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Custom Marker Pin dengan Emoji 🏠
      const customIcon = L.divIcon({
        className: "custom-map-marker",
        html: `<div style="background-color: #d97706; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.25); font-size: 16px;">🏠</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      // Pasang Marker ke Peta
      const marker = L.marker([finalLat, finalLng], { icon: customIcon }).addTo(map);

      // Tampilkan Popup jika Title / Alamat Tersedia
      if (title || address) {
        marker
          .bindPopup(
            `<div style="font-family: inherit; font-size: 12px; line-height: 1.4;">
              ${title ? `<b style="font-size: 13px;">${title}</b><br/>` : ""}
              ${address || ""}
            </div>`
          )
          .openPopup();
      }

      // Re-calculate ukuran elemen DOM agar tile peta ter-render sempurna
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    });

    // Cleanup saat unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [finalLat, finalLng, address, title]);

  return (
    <div className="space-y-3">
      {/* Header Alamat / Judul (Opsional) */}
      {(title || address) && (
        <div>
          <h3 className="font-heading text-base font-bold text-gray-900">
            Lokasi & Area Sekitar
          </h3>
          {address && <p className="text-xs text-gray-500">{address}</p>}
        </div>
      )}

      {/* Kontainer Peta */}
      <div
        ref={mapRef}
        style={{ height: "380px", width: "100%" }}
        className="relative z-0 overflow-hidden rounded-2xl border border-gray-200 shadow-sm"
      />
    </div>
  );
}