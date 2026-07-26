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
    <div className="border-border group flex h-full flex-col overflow-hidden rounded-xl border bg-white transition-all duration-300 hover:shadow-xl">
      {/* Image Container */}
      <div className="bg-muted relative h-56 w-full overflow-hidden">
        <Image
          src={property.imageUrl}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-primary rounded-md px-2.5 py-1 text-xs font-semibold text-white uppercase">
            {property.status}
          </span>
          {property.isFeatured && (
            <span className="bg-secondary rounded-md px-2.5 py-1 text-xs font-semibold text-white">
              Featured
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex grow flex-col justify-between p-5">
        <div>
          <div className="text-secondary mb-2 text-xl font-bold">{property.price}</div>
          <Link href={`/listing/${property.slug}`}>
            <h3 className="font-heading text-primary hover:text-secondary line-clamp-1 text-lg font-semibold transition-colors">
              {property.title}
            </h3>
          </Link>
          <div className="text-muted-foreground mt-2 mb-4 flex items-center gap-1 text-sm">
            <MapPin className="text-secondary h-4 w-4 shrink-0" />
            <span className="line-clamp-1">{property.location}</span>
          </div>
        </div>

        {/* Specs */}
        <div className="border-border text-muted-foreground grid grid-cols-3 gap-2 border-t py-3 text-xs">
          <div className="flex items-center gap-1.5">
            <Bed className="text-primary h-4 w-4" />
            <span>{property.bedrooms} KT</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="text-primary h-4 w-4" />
            <span>{property.bathrooms} KM</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Square className="text-primary h-4 w-4" />
            <span>LB {property.buildingArea}m²</span>
          </div>
        </div>
      </div>
    </div>
  );
}
