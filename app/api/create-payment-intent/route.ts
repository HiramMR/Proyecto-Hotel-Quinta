// ============================================================
// app/api/create-payment-intent/route.ts
// Crea un "Intento de Pago" en Stripe y devuelve el client_secret
// que el frontend requiere para procesar el pago de forma segura.
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover' as any,
});

export async function POST(req: NextRequest) {
  try {
    const { amount, reservationId } = await req.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe exige procesar en centavos
      currency: 'mxn',
      metadata: {
        reservationId: reservationId.toString(),
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}