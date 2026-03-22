// ============================================================
// lib/stripe.ts — Cliente de Stripe para el navegador
//
// loadStripe inicializa Stripe con la publishable key.
// Se importa en los componentes que necesiten procesar pagos.
// ============================================================
import { loadStripe } from '@stripe/stripe-js'

export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)