// ============================================================
// app/api/create-reservation/route.ts
//
// Crea reservaciones de transferencia y efectivo en el servidor
// usando supabaseAdmin para bypasear RLS y evitar timeouts.
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { user_id, room_id, fecha_llegada, fecha_salida, noches, total, metodo_pago } = await req.json()

    if (!user_id || !room_id || !fecha_llegada || !fecha_salida || !metodo_pago) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('reservations')
      .insert({
        user_id,
        room_id,
        fecha_llegada,
        fecha_salida,
        noches,
        total,
        metodo_pago,
        estado: 'confirmada',
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}