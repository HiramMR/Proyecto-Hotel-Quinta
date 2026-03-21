// ============================================================
// app/api/upload-comprobante/route.ts
//
// Recibe el comprobante de pago, lo sube a Supabase Storage
// y envía un correo al admin con el comprobante adjunto.
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const reservationId = formData.get('reservationId') as string
    const userId = formData.get('userId') as string

    if (!file || !reservationId || !userId) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 })
    }

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'El archivo no debe superar 5 MB' }, { status: 400 })
    }

    // Validar tipo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de archivo no permitido' }, { status: 400 })
    }

    // Subir a Supabase Storage
    const ext = file.name.split('.').pop()
    const fileName = `${userId}/${reservationId}-${Date.now()}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const { error: uploadError } = await supabaseAdmin.storage
      .from('comprobantes')
      .upload(fileName, buffer, { contentType: file.type, upsert: true })

    if (uploadError) {
      return NextResponse.json({ error: 'Error al subir el archivo' }, { status: 500 })
    }

    // Obtener URL firmada (válida 7 días para que el admin la vea)
    const { data: signedUrl } = await supabaseAdmin.storage
      .from('comprobantes')
      .createSignedUrl(fileName, 60 * 60 * 24 * 7)

    // Obtener datos de la reservación
    const { data: reservation } = await supabaseAdmin
      .from('reservations')
      .select('*, rooms(title), profiles(nombre, apellido, telefono)')
      .eq('id', reservationId)
      .single()

    // Obtener correo del usuario
    const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(userId)
    const userEmail = authUser?.user?.email ?? 'No disponible'
    const userName = reservation?.profiles
      ? `${reservation.profiles.nombre ?? ''} ${reservation.profiles.apellido ?? ''}`.trim()
      : 'Usuario'

    // Marcar que se subió el comprobante
    await supabaseAdmin
      .from('reservations')
      .update({ comprobante_url: fileName })
      .eq('id', reservationId)

    // Enviar correo al admin
    await resend.emails.send({
      from: 'Hotel Quinta Dalam <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL!,
      subject: `🧾 Comprobante de transferencia — Reservación #${reservationId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2C2420;">
          <div style="background: #2C2420; padding: 24px 32px; border-radius: 8px 8px 0 0;">
            <h1 style="color: #C8813A; font-size: 1.4rem; margin: 0;">Hotel Quinta Dalam</h1>
            <p style="color: rgba(245,240,232,0.7); font-size: 0.8rem; margin: 4px 0 0;">Comprobante de transferencia recibido</p>
          </div>
          <div style="background: #F5F0E8; padding: 32px; border-radius: 0 0 8px 8px; border: 1px solid #DDD5C5;">
            <h2 style="font-size: 1.1rem; margin: 0 0 20px; color: #2C2420;">
              🧾 Nuevo comprobante de pago
            </h2>

            <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
              <tr style="border-bottom: 1px solid #DDD5C5;">
                <td style="padding: 10px 0; color: #8B7355; width: 35%;">Reservación</td>
                <td style="padding: 10px 0; font-weight: 600;">#${reservationId}</td>
              </tr>
              <tr style="border-bottom: 1px solid #DDD5C5;">
                <td style="padding: 10px 0; color: #8B7355;">Habitación</td>
                <td style="padding: 10px 0; font-weight: 600;">${reservation?.rooms?.title ?? '—'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #DDD5C5;">
                <td style="padding: 10px 0; color: #8B7355;">Huésped</td>
                <td style="padding: 10px 0; font-weight: 600;">${userName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #DDD5C5;">
                <td style="padding: 10px 0; color: #8B7355;">Correo</td>
                <td style="padding: 10px 0;">${userEmail}</td>
              </tr>
              ${reservation?.profiles?.telefono ? `
              <tr style="border-bottom: 1px solid #DDD5C5;">
                <td style="padding: 10px 0; color: #8B7355;">Teléfono</td>
                <td style="padding: 10px 0;">${reservation.profiles.telefono}</td>
              </tr>` : ''}
              <tr style="border-bottom: 1px solid #DDD5C5;">
                <td style="padding: 10px 0; color: #8B7355;">Monto</td>
                <td style="padding: 10px 0; font-weight: 700; color: #C8813A; font-size: 1rem;">$${reservation?.total ?? '—'} MXN</td>
              </tr>
            </table>

            ${signedUrl?.signedUrl ? `
            <div style="margin-top: 24px; text-align: center;">
              <a href="${signedUrl.signedUrl}"
                style="display: inline-block; padding: 12px 28px; background: #C8813A; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 0.9rem;">
                Ver comprobante
              </a>
              <p style="margin: 8px 0 0; font-size: 0.75rem; color: #8B7355;">El enlace es válido por 7 días</p>
            </div>` : ''}

            <div style="margin-top: 24px; padding: 14px; background: rgba(200,129,58,0.08); border-left: 3px solid #C8813A; border-radius: 4px;">
              <p style="margin: 0; font-size: 0.85rem; color: #8B7355;">
                <strong>Acción requerida:</strong> Verifica el comprobante y marca la reservación #${reservationId} como <strong>pagada</strong> en el panel de administración.
              </p>
            </div>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}