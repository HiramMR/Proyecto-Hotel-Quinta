// ============================================================
// Carousel.tsx — Carrusel de imágenes reutilizable (Client Component)
//
// Usos en el proyecto:
// 1. Hero de la página de inicio (con autoSlide=true y priority=true)
// 2. Carrusel principal en /rooms (con slides que incluyen contenido JSX)
// 3. Carrusel interno de cada RoomCard (con autoSlide=false)
//
// Props:
// - images: array de rutas de imágenes (modo simple)
// - slides: array de { src, content } (modo con contenido superpuesto)
// - autoSlide: si avanza solo cada X milisegundos (default: true)
// - autoSlideInterval: tiempo entre slides en ms (default: 5000)
// - priority: si la primera imagen debe cargarse con prioridad (LCP)
// ============================================================
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

// ── Tipo para slides con contenido JSX superpuesto ──
export interface Slide {
  src: string;
  content?: React.ReactNode; // Texto, botones, etc. sobre la imagen
}

interface CarouselProps {
  images?: string[];
  slides?: Slide[];
  className?: string;
  autoSlide?: boolean;
  autoSlideInterval?: number;
  priority?: boolean; // true = carga inmediata de la primera imagen (mejora LCP)
}

// Imágenes por defecto si no se pasan props (fallback de emergencia)
const defaultImages = ["/img/banner.png", "/img/banner.png", "/img/banner.png"];

export default function Carousel({
  images = defaultImages,
  slides,
  className,
  autoSlide = true,
  autoSlideInterval = 5000,
  priority = false,
}: CarouselProps) {
  // curr: índice del slide actualmente visible
  const [curr, setCurr] = useState(0);

  // items: unificamos el modo "images" y el modo "slides" en un solo array
  const items: Slide[] = slides || images.map(src => ({ src }));

  // ── Funciones de navegación con useCallback ──
  // useCallback memoriza la función y solo la recrea si cambia items.length.
  // Sin esto, next() se recrearía en cada render, causando que el useEffect
  // del intervalo se ejecute constantemente y reinicie el temporizador.
  const next = useCallback(() => {
    setCurr(c => (c === items.length - 1 ? 0 : c + 1)); // Vuelve al inicio al llegar al final
  }, [items.length]);

  const prev = useCallback(() => {
    setCurr(c => (c === 0 ? items.length - 1 : c - 1)); // Va al final si está en el primero
  }, [items.length]);

  // ── Auto-avance ──
  // Solo depende de next (estable gracias a useCallback), autoSlide e interval.
  // No incluye curr en las dependencias — eso evitaba reiniciar el temporizador
  // en cada cambio de slide.
  useEffect(() => {
    if (!autoSlide) return;
    const interval = setInterval(next, autoSlideInterval);
    return () => clearInterval(interval); // Limpiar al desmontar o cambiar props
  }, [autoSlide, autoSlideInterval, next]);

  return (
    <div className="relative w-full group overflow-hidden" style={{ height: '100%' }}>

      {/* ── Pista de slides ──
          Se mueve horizontalmente con transform: translateX.
          Cada slide ocupa el 100% del ancho, por eso multiplicamos por curr. */}
      <div className={`relative w-full h-full ${className ?? ''}`}>
        <div
          className="flex transition-transform ease-out duration-700 h-full"
          style={{ transform: `translateX(-${curr * 100}%)` }}
        >
          {items.map((slide, i) => (
            <div key={i} className="relative w-full h-full shrink-0">
              {/* priority=true en el primer slide del hero mejora el LCP (Largest Contentful Paint).
                  Los demás slides se cargan de forma lazy para no bloquear recursos. */}
              <Image
                src={slide.src}
                alt={`Slide ${i}`}
                fill
                className="object-cover"
                priority={priority && i === 0}          // Solo el primero tiene prioridad
                loading={priority && i === 0 ? undefined : 'lazy'} // Lazy en el resto
                sizes="100vw" // Indica al navegador que la imagen ocupa el ancho completo
              />
              {/* Contenido JSX superpuesto (solo en modo slides, ej. nombre de habitación) */}
              {slide.content && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white p-4">
                  {slide.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Flechas de navegación ──
          En desktop: se muestran al hacer hover (group-hover).
          En móvil: siempre visibles (táctil no tiene hover). */}
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

      {/* ── Puntos indicadores ──
          El punto activo es más ancho (1.25rem) que los inactivos (0.5rem).
          El click en cada punto salta directamente a ese slide. */}
      <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurr(i)}
            aria-label={`Ir a slide ${i + 1}`}
            className="transition-all rounded-full"
            style={{
              width: curr === i ? '1.25rem' : '0.5rem', // Activo: más ancho
              height: '0.5rem',
              backgroundColor: curr === i ? 'var(--copper)' : 'rgba(245,240,232,0.5)',
            }}
          />
        ))}
      </div>
    </div>
  );
}