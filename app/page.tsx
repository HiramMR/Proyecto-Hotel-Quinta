// ============================================================
// app/page.tsx — Página de inicio (Server Component)
// Ahora carga las habitaciones destacadas desde Supabase
// en lugar de usar datos estáticos.
// ============================================================
import HomeClient from './components/HomeClient';
import { supabase } from '../lib/supabase';

const bannerImages = [
  '/img/carrusel/outside.jpg',
  '/img/carrusel/lobby.jpg',
  '/img/carrusel/lobby2.jpg',
  '/img/carrusel/lobby3.jpg',
  '/img/carrusel/lobby4.jpg',
  '/img/carrusel/lago2.jpg',
];

const features = [
  { icon: '🌊', title: 'Frente al Manantial',    description: 'Despierta cada mañana con la vista al manantial directamente desde tu habitación.' },
  { icon: '🏺', title: 'Arte Local',        description: 'Cada rincón está decorado con artesanía purépecha auténtica, seleccionada por maestros artesanos.' },
  { icon: '🍽️', title: 'Gastronomía',      description: 'Sabores michoacanos de autor: cocina de temporada con ingredientes locales y recetas heredadas.' },
];

export default async function HomePage() {
  // Cargar habitaciones populares desde Supabase
  const { data } = await supabase
    .from('rooms')
    .select('*')
    .eq('popular', true)
    .order('id', { ascending: true })

  const featuredRooms = (data ?? []).map(r => ({
    id: r.id,
    title: r.title,
    description: r.description,
    longDescription: r.long_description,
    price: r.price,
    capacity: r.capacity,
    stars: r.stars,
    popular: r.popular,
    images: r.images,
    amenities: r.amenities,
  }))

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