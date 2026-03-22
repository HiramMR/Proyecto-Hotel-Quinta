// ============================================================
// app/api/confirm-reservation/route.ts
//
// API Route que marca la reservación como pagada en Supabase
// después de que Stripe confirma el pago exitosamente.
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
})

// Cliente de Supabase con service role para bypasear RLS
// Solo se usa en el servidor
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { paymentIntentId, reservationId } = await req.json()

    // Verificar con Stripe que el pago realmente se completó
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json({ error: 'Pago no completado' }, { status: 400 })
    }

    // Marcar la reservación como pagada en Supabase
    await supabaseAdmin
      .from('reservations')
      .update({ estado: 'pagada', payment_intent_id: paymentIntentId })
      .eq('id', reservationId)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

