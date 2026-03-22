// ============================================================
// app/rooms/page.tsx — Server Component
//
// Carga TODAS las habitaciones desde Supabase en el servidor.
// Las pasa como props a RoomsClient (Client Component) que maneja
// el buscador, filtros, carousel y modal.
// Así nunca hay timing issues con el cliente de Supabase en el browser.
// ============================================================
import { supabase } from '../../lib/supabase'
import RoomsClient from './RoomsClient'

export default async function RoomsPage() {
  const { data } = await supabase
    .from('rooms')
    .select('*')
    .order('id', { ascending: true })

  const rooms = (data ?? []).map(r => ({
    id:              r.id,
    title:           r.title,
    description:     r.description,
    longDescription: r.long_description,
    price:           r.price,
    capacity:        r.capacity,
    stars:           r.stars,
    popular:         r.popular,
    images:          r.images,
    amenities:       r.amenities,
  }))

  return <RoomsClient allRooms={rooms} />
}