// ============================================================
// app/api/cancel-reservation/route.ts
//
// Cancela una reservación y gestiona el reembolso según método de pago:
// - card: reembolso automático via Stripe
// - transfer / cash: marca como cancelada (reembolso manual por el hotel)
// Solo se puede cancelar si faltan más de 48h para el check-in.
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
})

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { reservationId } = await req.json()

    // Obtener la reservación
    const { data: reservation, error: fetchError } = await supabaseAdmin
      .from('reservations')
      .select('*')
      .eq('id', reservationId)
      .single()

    if (fetchError || !reservation) {
      return NextResponse.json({ error: 'Reservación no encontrada' }, { status: 404 })
    }

    // Verificar que falten más de 48h para el check-in
    const llegada = new Date(reservation.fecha_llegada + 'T00:00:00')
    const ahora = new Date()
    const horas = (llegada.getTime() - ahora.getTime()) / (1000 * 60 * 60)

    if (horas <= 48) {
      return NextResponse.json(
        { error: 'No se puede cancelar con menos de 48 horas de anticipación' },
        { status: 400 }
      )
    }

    // Verificar que la reservación no esté ya cancelada
    if (reservation.estado === 'cancelada') {
      return NextResponse.json({ error: 'La reservación ya está cancelada' }, { status: 400 })
    }

    let refundId: string | null = null
    let needsManualRefund = false

    // Si pagó con tarjeta y tiene payment_intent_id → reembolso automático con Stripe
    if (reservation.metodo_pago === 'card' && reservation.payment_intent_id) {
      // Verificar si ya tiene un reembolso previo para no duplicarlo
      if (reservation.refund_id) {
        // Ya fue reembolsado antes, solo cancelar en Supabase
        refundId = reservation.refund_id
      } else {
        const refund = await stripe.refunds.create({
          payment_intent: reservation.payment_intent_id,
          reason: 'requested_by_customer',
        })
        refundId = refund.id
      }
    } else if (reservation.metodo_pago === 'transfer' || reservation.metodo_pago === 'cash') {
      needsManualRefund = true
    }

    // Cancelar la reservación en Supabase
    await supabaseAdmin
      .from('reservations')
      .update({
        estado: 'cancelada',
        ...(refundId ? { refund_id: refundId } : {}),
        ...(needsManualRefund ? { refund_requested: true } : {}),
      })
      .eq('id', reservationId)

    // Obtener datos del usuario para el correo
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('nombre, apellido, telefono')
      .eq('id', reservation.user_id)
      .single()

    const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(reservation.user_id)
    const userEmail = authUser?.user?.email ?? 'No disponible'
    const userName = profile
      ? `${profile.nombre ?? ''} ${profile.apellido ?? ''}`.trim()
      : 'Usuario'

    const metodoPagoLabel: Record<string, string> = {
      card: 'Tarjeta de crédito/débito',
      transfer: 'Transferencia bancaria',
      cash: 'Pago en recepción',
    }

    // Enviar correo al admin
    await resend.emails.send({
      from: 'Hotel Quinta Dalam <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL!,
      subject: refundId
        ? `✅ Reembolso procesado automáticamente — Reservación #${reservationId}`
        : `⚠️ Solicitud de reembolso manual — Reservación #${reservationId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2C2420;">
          <div style="background: #2C2420; padding: 24px 32px; border-radius: 8px 8px 0 0;">
            <h1 style="color: #C8813A; font-size: 1.4rem; margin: 0;">Hotel Quinta Dalam</h1>
            <p style="color: rgba(245,240,232,0.7); font-size: 0.8rem; margin: 4px 0 0;">Panel de administración</p>
          </div>
          <div style="background: #F5F0E8; padding: 32px; border-radius: 0 0 8px 8px; border: 1px solid #DDD5C5;">
            <h2 style="font-size: 1.2rem; margin: 0 0 8px;">
              ${refundId ? '✅ Reembolso procesado automáticamente' : '⚠️ Solicitud de reembolso manual pendiente'}
            </h2>
            <p style="color: #8B7355; font-size: 0.9rem; margin: 0 0 24px;">
              ${refundId
                ? 'Stripe procesó el reembolso automáticamente. No se requiere acción.'
                : 'El cliente canceló su reservación y requiere reembolso manual por parte del hotel.'}
            </p>

            <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
              <tr style="border-bottom: 1px solid #DDD5C5;">
                <td style="padding: 10px 0; color: #8B7355; width: 40%;">Reservación</td>
                <td style="padding: 10px 0; font-weight: 600;">#${reservationId}</td>
              </tr>
              <tr style="border-bottom: 1px solid #DDD5C5;">
                <td style="padding: 10px 0; color: #8B7355;">Habitación</td>
                <td style="padding: 10px 0; font-weight: 600;">${reservation.rooms?.title ?? `ID ${reservation.room_id}`}</td>
              </tr>
              <tr style="border-bottom: 1px solid #DDD5C5;">
                <td style="padding: 10px 0; color: #8B7355;">Huésped</td>
                <td style="padding: 10px 0; font-weight: 600;">${userName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #DDD5C5;">
                <td style="padding: 10px 0; color: #8B7355;">Correo</td>
                <td style="padding: 10px 0;">${userEmail}</td>
              </tr>
              ${profile?.telefono ? `
              <tr style="border-bottom: 1px solid #DDD5C5;">
                <td style="padding: 10px 0; color: #8B7355;">Teléfono</td>
                <td style="padding: 10px 0;">${profile.telefono}</td>
              </tr>` : ''}
              <tr style="border-bottom: 1px solid #DDD5C5;">
                <td style="padding: 10px 0; color: #8B7355;">Fechas</td>
                <td style="padding: 10px 0;">${reservation.fecha_llegada} → ${reservation.fecha_salida} (${reservation.noches} noches)</td>
              </tr>
              <tr style="border-bottom: 1px solid #DDD5C5;">
                <td style="padding: 10px 0; color: #8B7355;">Método de pago</td>
                <td style="padding: 10px 0;">${metodoPagoLabel[reservation.metodo_pago] ?? reservation.metodo_pago}</td>
              </tr>
              <tr style="border-bottom: 1px solid #DDD5C5;">
                <td style="padding: 10px 0; color: #8B7355;">Monto a reembolsar</td>
                <td style="padding: 10px 0; font-weight: 700; color: #C8813A; font-size: 1.1rem;">$${reservation.total} MXN</td>
              </tr>
              ${refundId ? `
              <tr>
                <td style="padding: 10px 0; color: #8B7355;">ID de reembolso Stripe</td>
                <td style="padding: 10px 0; font-family: monospace; font-size: 0.8rem;">${refundId}</td>
              </tr>` : ''}
            </table>

            ${!refundId ? `
            <div style="margin-top: 24px; padding: 16px; background: rgba(200,129,58,0.08); border-left: 3px solid #C8813A; border-radius: 4px;">
              <p style="margin: 0; font-size: 0.85rem; color: #8B7355;">
                <strong>Acción requerida:</strong> Contacta al cliente para coordinar el reembolso por ${metodoPagoLabel[reservation.metodo_pago] ?? reservation.metodo_pago}.
                Puedes gestionar esta solicitud en el panel de administración.
              </p>
            </div>` : ''}
          </div>
        </div>
      `,
    })

    return NextResponse.json({
      success: true,
      refunded: !!refundId,
      manualRefund: needsManualRefund,
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}