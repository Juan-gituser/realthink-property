"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface PropertyMapProps {
  lat: number;
  lng: number;
  address: string;
  title: string;
}

export default function PropertyMap({ lat, lng, address, title }: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Inisialisasi Peta
    const map = L.map(mapRef.current).setView([lat, lng], 15);

    // Tile Layer OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Custom Marker Icon
    const customIcon = L.divIcon({
      className: "custom-map-marker",
      html: `<div style="background-color: #d97706; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.25); font-size: 16px;">🏠</div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    // Tambahkan Marker ke Peta
    L.marker([lat, lng], { icon: customIcon })
      .addTo(map)
      .bindPopup(`<div style="font-family: inherit; font-size: 12px;"><b style="font-size: 13px;">${title}</b><br/>${address}</div>`)
      .openPopup();

    return () => {
      map.remove();
    };
  }, [lat, lng, address, title]);

  return (
    <div className="space-y-3">
      <div>
        <h3 className="font-heading font-bold text-gray-900 text-base">
          Lokasi & Area Sekitar
        </h3>
        <p className="text-xs text-gray-500">{address}</p>
      </div>
      <div 
        ref={mapRef} 
        className="w-full h-95[380px] rounded-2xl border border-gray-200 shadow-sm z-0 relative overflow-hidden" 
      />
    </div>
  );
}