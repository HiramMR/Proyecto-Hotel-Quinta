// ============================================================
// app/page.tsx — Página de inicio (Server Component raíz)
//
// TIPO: Server Component (no tiene 'use client')
// CUÁNDO CORRE: En el servidor de Node.js, nunca en el navegador.
//
// RESPONSABILIDADES:
//   1. Definir los datos estáticos de la aplicación:
//      - Imágenes del carrusel del hero
//      - Habitaciones destacadas con todos sus campos
//      - Características del hotel para la sección "Por qué elegirnos"
//   2. Pasarlos como props a HomeClient (Client Component)
//
// POR QUÉ SEPARAR Server y Client Component:
//   - Los Server Components no pueden usar hooks (useState, useEffect)
//     ni escuchar eventos del navegador (click, scroll).
//   - Los Client Components sí pueden, pero no pueden acceder a la DB
//     o a variables de entorno privadas directamente.
//   - Patrón recomendado: el Server Component obtiene los datos y
//     el Client Component los recibe por props y maneja la interactividad.
// ============================================================

import HomeClient from './components/HomeClient';

// ── Imágenes del carrusel del hero ──
// Rutas relativas a la carpeta /public. Next.js sirve todo lo
// que esté en /public como archivos estáticos desde la raíz.
const bannerImages = [
  '/img/carrusel/lago.jpg',
  '/img/carrusel/lobby.jpg',
  '/img/carrusel/lobby2.jpg',
  '/img/carrusel/outside.jpg',
];

// ── Habitaciones destacadas ──
// Estas son las 3 habitaciones que aparecen en el home.
// Contienen TODOS los campos necesarios para que RoomModal
// pueda mostrar el detalle completo al hacer clic en "Reservar".
//
// NOTA: hay un id:3 duplicado — se filtra en HomeClient con
// Array.from(new Map(...)) para evitar el error de key duplicado en React.
const featuredRooms = [
  {
    id: 1,
    title: 'Suite de Lujo',
    popular: true,        // Muestra el badge "Popular" en la tarjeta
    stars: 5,             // Estrellas mostradas en el modal (1-5)
    capacity: 2,          // Número de huéspedes (mostrado en badge de la imagen)
    price: 250,           // Precio por noche en dólares (o pesos según configuración)
    images: ['/img/room1.jpg', '/img/room2.jpg', '/img/room3.jpg', '/img/room4.jpg'],
    amenities: ['1 Cama', 'Agua caliente', 'Wifi', 'Minibar'],
    description: 'Espacio amplio con jacuzzi privado y vista panorámica al lago.',
    // longDescription: texto largo que aparece en el modal (paso 1 - detalle)
    longDescription:
      'Nuestra Suite de Lujo es la experiencia definitiva en Hotel Quinta Dalam. Ubicada en el piso superior con vista panorámica al Lago de Pátzcuaro, ofrece una cama king size con ropa de cama artesanal, jacuzzi privado en la terraza, sala de estar independiente y minibar surtido con productos locales. Cada amanecer sobre el lago es una obra de arte que podrás contemplar desde la comodidad de tu cama. Incluye servicio de mayordomo, desayuno gourmet y atención personalizada las 24 horas.',
  },
  {
    id: 2,
    title: 'Habitación Familiar',
    popular: true,
    stars: 4,
    capacity: 4,
    price: 180,
    images: ['/img/room2.jpg', '/img/room1.jpg', '/img/room3.jpg', '/img/room4.jpg'],
    amenities: ['2 Camas', 'Television', 'Room-service'],
    description: 'Espaciosa habitación ideal para familias con dos camas queen.',
    longDescription:
      'La Habitación Familiar fue diseñada pensando en que cada miembro de la familia disfrute su estancia al máximo. Con dos camas queen size, área de estar con sofá y televisión de pantalla plana, es perfecta para viajes en familia o grupos de amigos. La distribución del espacio garantiza privacidad y confort para todos. Cuenta con servicio de cuarto las 24 horas, y está a pasos del jardín y la alberca del hotel.',
  },
  {
    id: 3,
    title: 'Habitación Estándar',
    popular: false,
    stars: 4,
    capacity: 2,
    price: 100,
    images: ['/img/room3.jpg', '/img/room2.jpg', '/img/room1.jpg', '/img/room4.jpg'],
    amenities: ['1 Cama', 'Wifi'],
    description: 'Comodidad y calidez para una estancia placentera.',
    longDescription:
      'La Habitación Estándar combina sencillez y calidez michoacana. Decorada con artesanías locales y muebles de madera tallada a mano, ofrece todo lo necesario para un descanso genuino. Cama matrimonial con colchón de alta densidad, baño con regadera de lluvia, Wi-Fi de alta velocidad y luz natural que inunda el espacio cada mañana. Ideal para viajeros que buscan comodidad sin complicaciones.',
  },
  // ← id:3 duplicado — HomeClient lo filtra automáticamente con Map
  {
    id: 4,
    title: 'Habitación Estándar',
    popular: false,
    stars: 4,
    capacity: 2,
    price: 100,
    images: ['/img/room3.jpg', '/img/room2.jpg', '/img/room1.jpg', '/img/room4.jpg'],
    amenities: ['1 Cama', 'Wifi'],
    description: 'Comodidad y calidez para una estancia placentera.',
    longDescription:
      'La Habitación Estándar combina sencillez y calidez michoacana. Decorada con artesanías locales y muebles de madera tallada a mano, ofrece todo lo necesario para un descanso genuino. Cama matrimonial con colchón de alta densidad, baño con regadera de lluvia, Wi-Fi de alta velocidad y luz natural que inunda el espacio cada mañana. Ideal para viajeros que buscan comodidad sin complicaciones.',
  },
];

// ── Características del hotel para la sección "¿Por qué elegirnos?" ──
// Array de objetos con ícono emoji, título y descripción.
// Se renderizan como tarjetas en HomeClient.
const features = [
  { icon: '🌊', title: 'Frente al Lago',    description: 'Despierta cada mañana con la vista al Lago de Pátzcuaro directamente desde tu habitación.' },
  { icon: '🏺', title: 'Arte Local',        description: 'Cada rincón está decorado con artesanía purépecha auténtica, seleccionada por maestros artesanos.' },
  { icon: '🍽️', title: 'Gastronomía',      description: 'Sabores michoacanos de autor: cocina de temporada con ingredientes locales y recetas heredadas.' },
];

// ── Componente raíz de la página ──
// `export default` es obligatorio en Next.js App Router para que
// el framework sepa qué componente renderizar para esta ruta.
export default function HomePage() {
  return (
    // style inline aquí para controlar el fondo con la variable del sistema de diseño
    // overflowX: hidden previene scroll horizontal por animaciones que sobresalen
    <main style={{ backgroundColor: 'var(--cream)', overflowX: 'hidden' }}>
      {/* HomeClient recibe todos los datos y maneja toda la interactividad */}
      <HomeClient
        bannerImages={bannerImages}
        featuredRooms={featuredRooms}
        features={features}
      />
    </main>
  );
}
