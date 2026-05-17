import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ exists: false })

    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 })
    if (error) throw error

    const exists = users.some(u => u.email === email)
    return NextResponse.json({ exists })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}