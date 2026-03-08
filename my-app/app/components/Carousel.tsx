"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

export interface Slide {
  src: string;
  content?: React.ReactNode;
}

interface CarouselProps {
  images?: string[];
  slides?: Slide[];
  className?: string;
  autoSlide?: boolean;
  autoSlideInterval?: number;
  priority?: boolean;
}

const defaultImages = ["/img/banner.png", "/img/banner.png", "/img/banner.png"];

export default function Carousel({
  images = defaultImages,
  slides,
  className,
  autoSlide = true,
  autoSlideInterval = 5000,
  priority = false,
}: CarouselProps) {
  const [curr, setCurr] = useState(0);
  const items: Slide[] = slides || images.map(src => ({ src }));

  // ✅ PUNTO 2: useCallback evita que next() se recree en cada render,
  // y el useEffect solo depende del intervalo — no de curr.
  const next = useCallback(() => {
    setCurr(c => (c === items.length - 1 ? 0 : c + 1));
  }, [items.length]);

  const prev = useCallback(() => {
    setCurr(c => (c === 0 ? items.length - 1 : c - 1));
  }, [items.length]);

  useEffect(() => {
    if (!autoSlide) return;
    const interval = setInterval(next, autoSlideInterval);
    return () => clearInterval(interval);
  }, [autoSlide, autoSlideInterval, next]); // ✅ Sin 'curr' — ya no se recrea el intervalo en cada slide

  return (
    <div className="relative w-full group overflow-hidden" style={{ height: '100%' }}>

      <div className={`relative w-full h-full ${className ?? ''}`}>
        <div
          className="flex transition-transform ease-out duration-700 h-full"
          style={{ transform: `translateX(-${curr * 100}%)` }}
        >
          {items.map((slide, i) => (
            <div key={i} className="relative w-full h-full shrink-0">
              {/* ✅ PUNTO 1: priority en la primera imagen, lazy en el resto */}
              <Image
                src={slide.src}
                alt={`Slide ${i}`}
                fill
                className="object-cover"
                priority={priority && i === 0}
                loading={priority && i === 0 ? undefined : 'lazy'}
                sizes="100vw"
              />
              {slide.content && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white p-4">
                  {slide.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Flechas — visibles en hover en desktop, siempre visibles en móvil */}
      <div className="absolute inset-0 flex items-center justify-between p-2 md:p-4 pointer-events-none">
        <button
          onClick={prev}
          aria-label="Anterior"
          className="pointer-events-auto p-2 md:p-1 rounded-full shadow bg-white/60 text-[var(--copper)] hover:bg-white transition-all md:hidden md:group-hover:block"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <button
          onClick={next}
          aria-label="Siguiente"
          className="pointer-events-auto p-2 md:p-1 rounded-full shadow bg-white/60 text-[var(--copper)] hover:bg-white transition-all md:hidden md:group-hover:block"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* Puntos */}
      <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurr(i)}
            aria-label={`Ir a slide ${i + 1}`}
            className="transition-all rounded-full"
            style={{
              width: curr === i ? '1.25rem' : '0.5rem',
              height: '0.5rem',
              backgroundColor: curr === i ? 'var(--copper)' : 'rgba(245,240,232,0.5)',
            }}
          />
        ))}
      </div>
    </div>
  );
}