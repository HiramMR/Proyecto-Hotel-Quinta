// ============================================================
// app/rooms/page.tsx — Server Component
//
// Renderiza el componente cliente de las habitaciones.
// ============================================================
import RoomsClient from './RoomsClient'

export default async function RoomsPage() {
  return <RoomsClient />
}