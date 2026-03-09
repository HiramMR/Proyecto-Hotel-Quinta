// ============================================================
// page.tsx — Página de inicio (Server Component)
// Al NO tener 'use client', Next.js la renderiza en el servidor.
// Ventajas: mejor SEO, primera carga más rápida, sin JS innecesario.
//
// Este archivo solo define los DATOS estáticos y se los pasa
// como props al componente HomeClient (que sí es 'use client').
// Así separamos datos (servidor) de interactividad (cliente).
// ============================================================

import HomeClient from './components/HomeClient';

// ── Imágenes del carrusel principal (hero) ──
// Rutas relativas a la carpeta /public
const bannerImages = [
  "/img/carrusel/outside.jpg",
  "/img/carrusel/lobby.jpg",
  "/img/carrusel/lobby2.jpg",
  "/img/carrusel/lago.jpg",
];

// ── Habitaciones destacadas en la sección del home ──
// Cada habitación tiene: id, título, descripción, precio/noche,
// array de imágenes (para el carrusel interno) y capacidad máxima.
const featuredRooms = [
  { id: 1, title: "Suite de Lujo",       description: "Espacio amplio con jacuzzi privado y vista panorámica al lago.", price: 250, images: ["/img/room1.jpg", "/img/room2.jpg", "/img/room3.jpg", "/img/room4.jpg"], capacity: 2 },
  { id: 2, title: "Habitación Familiar", description: "Espaciosa habitación ideal para familias. Dos camas queen y área de estar confortable.", price: 180, images: ["/img/room2.jpg", "/img/room1.jpg", "/img/room3.jpg", "/img/room4.jpg"], capacity: 4 },
  { id: 3, title: "Habitación Estándar", description: "Comodidad y calidez. Todo lo necesario para una estancia placentera y tranquila.", price: 100, images: ["/img/room3.jpg", "/img/room2.jpg", "/img/room1.jpg", "/img/room4.jpg"], capacity: 2 },
  { id: 4, title: "Habitación Sencilla", description: "Descanso genuino en un entorno íntimo y acogedor.", price: 100, images: ["/img/room4.jpg", "/img/room3.jpg", "/img/room2.jpg", "/img/room1.jpg"], capacity: 1 },
];

// ── Características destacadas del hotel (sección "¿Por qué elegirnos?") ──
const features = [
  { icon: "🌊", title: "Frente al Lago",         description: "Vistas privilegiadas al Lago de Pátzcuaro desde nuestras instalaciones. Una naturaleza que abraza cada momento de tu estancia." },
  { icon: "🍽️", title: "Gastronomía Michoacana", description: "Sabores auténticos de la cocina regional preparados con ingredientes locales de temporada. Una experiencia culinaria que refleja nuestra tierra." },
  { icon: "💆‍♀️", title: "Spa & Bienestar",       description: "Rituales de relajación inspirados en las tradiciones prehispánicas purépechas. Tu mente y cuerpo encontrarán el equilibrio perfecto." },
];

export default function HomePage() {
  return (
    // overflowX: 'hidden' evita scroll horizontal causado por animaciones
    // que desplazan elementos fuera de la pantalla momentáneamente
    <main style={{ backgroundColor: 'var(--cream)', overflowX: 'hidden' }}>
      {/* Pasamos todos los datos como props al componente cliente */}
      <HomeClient
        bannerImages={bannerImages}
        featuredRooms={featuredRooms}
        features={features}
      />
    </main>
  );
}