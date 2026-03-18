// ============================================================
// app/api/create-payment-intent/route.ts
//
// API Route que corre en el servidor (nunca en el navegador).
// Recibe el monto y crea un PaymentIntent en Stripe.
// Devuelve el clientSecret que el frontend usa para confirmar el pago.
//
// IMPORTANTE: La secret key de Stripe solo se usa aquí,
// nunca llega al navegador.
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
})

export async function POST(req: NextRequest) {
  try {
    const { amount, currency, metadata } = await req.json()

    // Crear el PaymentIntent en Stripe
    // amount debe estar en centavos (ej: $250 USD = 25000)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convertir a centavos
      currency: currency ?? 'mxn',
      automatic_payment_methods: { enabled: true },
      metadata, // datos extra: room_id, user_id, fechas, etc.
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}