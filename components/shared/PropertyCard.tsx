"use client";

import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Square, MapPin } from "lucide-react";

export interface PropertyProps {
  id: string;
  title: string;
  slug: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  landArea: number;
  buildingArea: number;
  imageUrl: string;
  isFeatured?: boolean;
  status: "dijual" | "disewa";
}

export default function PropertyCard({ property }: { property: PropertyProps }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
      {/* Image Container */}
      <div className="relative h-56 w-full overflow-hidden bg-muted">
        <Image
          src={property.imageUrl}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded-md uppercase">
            {property.status}
          </span>
          {property.isFeatured && (
            <span className="bg-secondary text-white text-xs font-semibold px-2.5 py-1 rounded-md">
              Featured
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col grow justify-between">
        <div>
          <div className="text-secondary font-bold text-xl mb-2">{property.price}</div>
          <Link href={`/listing/${property.slug}`}>
            <h3 className="font-heading font-semibold text-lg text-primary hover:text-secondary line-clamp-1 transition-colors">
              {property.title}
            </h3>
          </Link>
          <div className="flex items-center gap-1 text-muted-foreground text-sm mt-2 mb-4">
            <MapPin className="w-4 h-4 shrink-0 text-secondary" />
            <span className="line-clamp-1">{property.location}</span>
          </div>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-3 gap-2 py-3 border-t border-border text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Bed className="w-4 h-4 text-primary" />
            <span>{property.bedrooms} KT</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="w-4 h-4 text-primary" />
            <span>{property.bathrooms} KM</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Square className="w-4 h-4 text-primary" />
            <span>LB {property.buildingArea}m²</span>
          </div>
        </div>
      </div>
    </div>
  );
}