// ============================================================
// app/rooms/page.tsx — Server Component
//
// Renderiza el componente cliente de las habitaciones.
// ============================================================
import RoomsClient from './RoomsClient'
import { supabase } from '../../lib/supabase'

export default async function RoomsPage() {
  const { data } = await supabase
    .from('rooms')
    .select('*')
    .order('id', { ascending: true })

  const initialRooms = (data ?? []).map(r => ({
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

  return <RoomsClient initialRooms={initialRooms} />
}