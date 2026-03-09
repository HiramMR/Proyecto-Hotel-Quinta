// ============================================================
// page.tsx — Server Component raíz del inicio
//
// Define los datos de las habitaciones destacadas con todos los
// campos que necesita RoomModal (stars, longDescription, amenities).
// Los pasa como props a HomeClient (Client Component).
// ============================================================
import HomeClient from './components/HomeClient';

// ── Imágenes del carrusel del hero ──
const bannerImages = [
  '/img/carrusel/lago.jpg',
  '/img/carrusel/lobby.jpg',
  '/img/carrusel/lobby2.jpg',
  '/img/carrusel/outside.jpg',
];

// ── Habitaciones destacadas (con todos los campos para el modal) ──
const featuredRooms = [
  {
    id: 1,
    title: 'Suite de Lujo',
    popular: true,
    stars: 5,
    capacity: 2,
    price: 250,
    images: ['/img/room1.jpg', '/img/room2.jpg', '/img/room3.jpg', '/img/room4.jpg'],
    amenities: ['1 Cama', 'Agua caliente', 'Wifi', 'Minibar'],
    description: 'Espacio amplio con jacuzzi privado y vista panorámica al lago.',
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
];

// ── Características del hotel (sección "Por qué elegirnos") ──
const features = [
  { icon: '🌊', title: 'Frente al Lago',    description: 'Despierta cada mañana con la vista al Lago de Pátzcuaro directamente desde tu habitación.' },
  { icon: '🏺', title: 'Arte Local',        description: 'Cada rincón está decorado con artesanía purépecha auténtica, seleccionada por maestros artesanos.' },
  { icon: '🍽️', title: 'Gastronomía',      description: 'Sabores michoacanos de autor: cocina de temporada con ingredientes locales y recetas heredadas.' },
];

export default function HomePage() {
  return (
    <main style={{ backgroundColor: 'var(--cream)', overflowX: 'hidden' }}>
      <HomeClient
        bannerImages={bannerImages}
        featuredRooms={featuredRooms}
        features={features}
      />
    </main>
  );
}