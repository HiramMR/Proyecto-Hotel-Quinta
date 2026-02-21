
// Indica que este componente se ejecuta en el cliente (navegador), necesario para usar hooks como useState
"use client";

// Importa hooks de React para manejar estado y efectos secundarios
import { useState, useEffect } from "react";
// Importa el componente de imagen optimizado de Next.js
import Image from "next/image";

// Define la interfaz para las propiedades (props) que recibe el componente
interface CarouselProps {
  images?: string[]; // Array de strings que contiene las URLs de las imágenes (Opcional)
}

// Imágenes por defecto si no se pasan props
const defaultImages = [
  "/img/banner.png",
  "/img/banner.png",
  "/img/banner.png"
];

export default function Carousel({ images = defaultImages }: CarouselProps) {
  // Estado para rastrear el índice de la imagen actual visible
  const [curr, setCurr] = useState(0);

  // Función para retroceder a la imagen anterior
  const prev = () =>
    setCurr((curr) => (curr === 0 ? images.length - 1 : curr - 1)); // Si es la primera, va a la última (circular)
  
  // Función para avanzar a la siguiente imagen
  const next = () =>
    setCurr((curr) => (curr === images.length - 1 ? 0 : curr + 1)); // Si es la última, vuelve a la primera (circular)

  // Efecto para el cambio automático de diapositivas
  useEffect(() => {
    // Configura un intervalo que llama a la función 'next' cada 5000ms (5 segundos)
    const slideInterval = setInterval(next, 5000);
    // Función de limpieza que se ejecuta al desmontar el componente para evitar fugas de memoria
    return () => clearInterval(slideInterval);
  }, [next]); // Se ejecuta de nuevo si la función 'next' cambia

  return (
    // Contenedor principal del carrusel
    // overflow-hidden: oculta las imágenes que están fuera del área visible
    // relative: posicionamiento relativo para ubicar botones e indicadores dentro
    // group: permite aplicar estilos a hijos cuando se hace hover sobre este contenedor
    <div className="overflow-hidden relative w-full h-140 mb-12  shadow-lg shadow-gray-400 group">
      
      {/* Contenedor deslizante de las imágenes */}
      <div
        // flex: alinea las imágenes en una fila horizontal
        // transition-transform: anima el movimiento de deslizamiento
        // ease-out duration-500: suaviza la animación durante 0.7 segundos
        className="flex transition-transform ease-out duration-700 h-full"
        // Mueve el contenedor horizontalmente según el índice actual (curr * 100%)
        style={{ transform: `translateX(-${curr * 100}%)` }}
      >
        {/* Mapea cada URL de imagen a un elemento div con la imagen */}
        {images.map((src, i) => (
          // Contenedor individual para cada imagen
          // flex-shrink-0: evita que la imagen se encoja, manteniendo su ancho completo
          <div key={i} className="relative w-full h-full shrink-0">
            <Image
              src={src} // URL de la imagen
              alt={`Slide ${i}`} // Texto alternativo para accesibilidad
              fill // Hace que la imagen llene el contenedor padre
              className="object-cover" // Recorta la imagen para cubrir el área sin deformarse
            />
          </div>
        ))}
      </div>

      {/* Botones de navegación (Flechas izquierda/derecha) */}
      {/* absolute inset-0: cubre todo el contenedor para posicionar los botones a los lados */}
      <div className="absolute inset-0 flex items-center justify-between p-4">
        {/* Botón Anterior */}
        <button
          onClick={prev} // Llama a la función prev al hacer clic
          // hidden group-hover:block: Oculto por defecto, visible al pasar el mouse sobre el carrusel
          className="p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white hidden group-hover:block transition-all"
        >
          {/* Icono de flecha izquierda (SVG) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        
        {/* Botón Siguiente */}
        <button
          onClick={next} // Llama a la función next al hacer clic
          className="p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white hidden group-hover:block transition-all"
        >
          {/* Icono de flecha derecha (SVG) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>

      {/* Indicadores (puntos) en la parte inferior */}
      <div className="absolute bottom-4 right-0 left-0">
        <div className="flex items-center justify-center gap-2">
          {/* Genera un punto por cada imagen */}
          {images.map((_, i) => (
            <div
              key={i}
              // Cambia el estilo si es el punto activo (curr === i)
              // p-2: hace el punto más grande si está activo
              // bg-opacity-50: hace el punto semitransparente si no está activo
              className={`
              transition-all w-3 h-2 bg-gray-300 rounded-full
              ${curr === i ? "p-2" : "bg-opacity-50 bg-gray-300"}
            `}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
