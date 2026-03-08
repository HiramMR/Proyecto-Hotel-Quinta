"use client";

import Link from 'next/link';
import Carousel from './Carousel';

interface AmenityItem {
  name: string;
  icon: React.ReactNode;
}

interface RoomCardProps {
  title: string;
  description: string;
  price: number;
  images: string[];
  capacity?: number;
  amenities?: string[];
  amenitiesList?: AmenityItem[];
}

export default function RoomCard({ title, description, price, images, capacity, amenities, amenitiesList }: RoomCardProps) {
  return (
    <div className="card-warm w-full group">
      {/* Imagen */}
      <div className="relative h-64 overflow-hidden">
        <Carousel images={images} className="h-full" autoSlide={false} />
        <div className="absolute top-3 right-3 flex gap-2 z-10">
          <div className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide"
            style={{ backgroundColor: 'var(--copper)', color: '#fff', fontFamily: 'var(--font-ui)', letterSpacing: '0.06em' }}>
            Popular
          </div>
          {capacity && (
            <div className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
              style={{ backgroundColor: 'rgba(245,240,232,0.15)', backdropFilter: 'blur(8px)', color: 'var(--cream)', border: '1px solid rgba(245,240,232,0.25)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
              </svg>
              {capacity}
            </div>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
          style={{ background: 'linear-gradient(to top, var(--wood-dark), transparent)' }} />
      </div>

      {/* Contenido */}
      <div className="p-6">
        <h3 className="font-display text-2xl font-semibold mb-2 leading-tight"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--cream)' }}>
          {title}
        </h3>
        <p className="text-sm leading-relaxed mb-4 line-clamp-2"
          style={{ color: 'var(--text-light)', fontFamily: 'var(--font-body)' }}>
          {description}
        </p>

        {/* Amenidades */}
        {amenities && amenitiesList && amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {amenities.map(name => {
              const item = amenitiesList.find(a => a.name === name);
              return item ? (
                <div key={name} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
                  style={{ backgroundColor: 'rgba(245,240,232,0.1)', color: 'var(--text-light)', border: '1px solid rgba(245,240,232,0.15)', fontFamily: 'var(--font-ui)' }}>
                  {item.icon}
                  <span>{name}</span>
                </div>
              ) : null;
            })}
          </div>
        )}

        <div className="flex justify-between items-center pt-4"
          style={{ borderTop: '1px solid rgba(245,240,232,0.1)' }}>
          <div>
            <span className="font-display text-2xl font-semibold"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--copper)' }}>
              ${price}
            </span>
            <span className="text-xs ml-1" style={{ color: 'var(--text-light)' }}>/ noche</span>
          </div>
          <Link href="/rooms" className="btn-copper" style={{ fontSize: '0.68rem', padding: '0.6rem 1.4rem' }}>
            Reservar
          </Link>
        </div>
      </div>
    </div>
  );
}