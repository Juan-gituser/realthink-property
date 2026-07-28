"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { Search, Loader2, MapPin } from "lucide-react";

interface LocationPickerMapProps {
  address: string;
  onAddressChange: (address: string) => void;
  lat: number;
  lng: number;
  onLocationChange: (lat: number, lng: number) => void;
}

export default function LocationPickerMap({
  address,
  onAddressChange,
  lat,
  lng,
  onLocationChange,
}: LocationPickerMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const defaultLat = lat || -6.2; // Default Jakarta
  const defaultLng = lng || 106.816666;

  // Inisialisasi Peta & Marker
  useEffect(() => {
    if (!mapRef.current) return;

    let L: any;
    import("leaflet").then((leaflet) => {
      L = leaflet;
      if (!mapRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapRef.current).setView([defaultLat, defaultLng], 15);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Custom Icon Pin Merah 📍
      const customIcon = L.divIcon({
        className: "custom-map-picker-marker",
        html: `<div style="background-color: #ef4444; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 8px rgba(0,0,0,0.3); font-size: 18px;">📍</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      // Marker Draggable
      const marker = L.marker([defaultLat, defaultLng], {
        icon: customIcon,
        draggable: true,
      }).addTo(map);

      markerRef.current = marker;

      // Event saat marker ditarik & dilepas
      marker.on("dragend", () => {
        const position = marker.getLatLng();
        onLocationChange(position.lat, position.lng);
      });

      // Event saat area peta diklik
      map.on("click", (e: any) => {
        const { lat: newLat, lng: newLng } = e.latlng;
        marker.setLatLng([newLat, newLng]);
        onLocationChange(newLat, newLng);
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update posisi marker jika prop lat/lng berubah dari luar
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current && lat && lng) {
      markerRef.current.setLatLng([lat, lng]);
      mapInstanceRef.current.setView([lat, lng], mapInstanceRef.current.getZoom());
    }
  }, [lat, lng]);

  // Fungsi pencarian lokasi (Geocoding via OpenStreetMap Nominatim)
  const handleSearchLocation = async () => {
    if (!address.trim()) return;

    setIsSearching(true);
    setSearchError("");

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`
      );
      const data = await res.json();

      if (data && data.length > 0) {
        const resultLat = parseFloat(data[0].lat);
        const resultLng = parseFloat(data[0].lon);

        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([resultLat, resultLng], 16);
          markerRef.current.setLatLng([resultLat, resultLng]);
        }

        onLocationChange(resultLat, resultLng);
      } else {
        setSearchError("Lokasi tidak ditemukan. Coba masukkan nama jalan/kota yang lebih spesifik.");
      }
    } catch (err) {
      setSearchError("Gagal mencari lokasi. Periksa koneksi internet Anda.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Input Cari Lokasi */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearchLocation();
              }
            }}
            placeholder="Ketik alamat atau nama lokasi untuk dicari di peta..."
            className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-900 pr-10 focus:border-amber-500 focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={handleSearchLocation}
          disabled={isSearching}
          className="flex items-center gap-1.5 rounded-xl bg-gray-900 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-gray-800 disabled:opacity-50 cursor-pointer shrink-0"
        >
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
          ) : (
            <Search className="h-4 w-4 text-amber-400" />
          )}
          Cari Lokasi
        </button>
      </div>

      {searchError && (
        <p className="text-xs text-rose-500 font-medium">{searchError}</p>
      )}

      {/* Kontainer Peta */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200">
        <div ref={mapRef} className="h-80 w-full z-0" />
      </div>

      <div className="flex items-center justify-between text-[11px] text-gray-500 px-1">
        <span className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5 text-rose-500" />
          Geser pin 📍 atau klik peta untuk menentukan titik presisi.
        </span>
        <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-medium">
          {lat.toFixed(6)}, {lng.toFixed(6)}
        </span>
      </div>
    </div>
  );
}