// ============================================================
// app/api/contact/route.ts
//
// Recibe el formulario de contacto y envía un correo al admin
// con el nombre, teléfono y mensaje del cliente via Resend.
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { nombre, telefono, mensaje } = await req.json()

    if (!nombre?.trim() || !telefono?.trim() || !mensaje?.trim()) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios' }, { status: 400 })
    }

    await resend.emails.send({
      from: 'Hotel Quinta Dalam <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL!,
      subject: `📩 Nuevo mensaje de contacto — ${nombre}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2C2420;">
          <div style="background: #2C2420; padding: 24px 32px; border-radius: 8px 8px 0 0;">
            <h1 style="color: #C8813A; font-size: 1.4rem; margin: 0;">Hotel Quinta Dalam</h1>
            <p style="color: rgba(245,240,232,0.7); font-size: 0.8rem; margin: 4px 0 0;">Nuevo mensaje de contacto</p>
          </div>
          <div style="background: #F5F0E8; padding: 32px; border-radius: 0 0 8px 8px; border: 1px solid #DDD5C5;">
            <h2 style="font-size: 1.1rem; margin: 0 0 20px; color: #2C2420;">
              📩 ${nombre} te ha enviado un mensaje
            </h2>

            <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
              <tr style="border-bottom: 1px solid #DDD5C5;">
                <td style="padding: 10px 0; color: #8B7355; width: 35%;">Nombre</td>
                <td style="padding: 10px 0; font-weight: 600; color: #2C2420;">${nombre}</td>
              </tr>
              <tr style="border-bottom: 1px solid #DDD5C5;">
                <td style="padding: 10px 0; color: #8B7355;">Teléfono</td>
                <td style="padding: 10px 0; font-weight: 700; color: #C8813A; font-size: 1rem;">
                  <a href="tel:${telefono}" style="color: #C8813A; text-decoration: none;">${telefono}</a>
                </td>
              </tr>
            </table>

            <div style="margin-top: 20px; padding: 16px; background: #fff; border-radius: 8px; border: 1px solid #DDD5C5;">
              <p style="margin: 0 0 8px; font-size: 0.75rem; color: #8B7355; text-transform: uppercase; letter-spacing: 0.1em;">Mensaje</p>
              <p style="margin: 0; font-size: 0.9rem; color: #2C2420; line-height: 1.6; white-space: pre-wrap;">${mensaje}</p>
            </div>

            <div style="margin-top: 24px; padding: 14px; background: rgba(200,129,58,0.08); border-left: 3px solid #C8813A; border-radius: 4px;">
              <p style="margin: 0; font-size: 0.85rem; color: #8B7355;">
                <strong>Acción sugerida:</strong> Llama a ${nombre} al número <strong>${telefono}</strong> para atender su consulta.
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