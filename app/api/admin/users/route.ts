import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Cliente de Supabase con permisos de administrador (service_role)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Función para verificar si el usuario que hace la petición es admin
async function getAdminUser(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return null;

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return null;

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  return !profileError && profile?.role === 'admin' ? user : null;
}

// POST: Crear un nuevo usuario
export async function POST(request: Request) {
  const adminUser = await getAdminUser(request);
  if (!adminUser) {
    return NextResponse.json({ error: 'Acceso no autorizado' }, { status: 403 });
  }

  const { email, password, nombre, apellido, telefono, role } = await request.json();

  if (!email || !password || !nombre) {
    return NextResponse.json({ error: 'Faltan campos obligatorios (correo, contraseña, nombre).' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Auto-confirma el correo para usuarios creados por el admin
    user_metadata: {
      nombre,
      apellido,
      telefono,
      role,
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // El trigger en la DB crea el perfil, pero devolvemos los datos para actualizar la UI
  const newUserProfile = {
    id: data.user.id,
    email: data.user.email,
    created_at: data.user.created_at,
    nombre,
    apellido,
    telefono,
    role,
  };

  return NextResponse.json(newUserProfile);
}

// DELETE: Eliminar un usuario
export async function DELETE(request: Request) {
  const adminUser = await getAdminUser(request);
  if (!adminUser) {
    return NextResponse.json({ error: 'Acceso no autorizado' }, { status: 403 });
  }

  const { userId } = await request.json();
  if (!userId) return NextResponse.json({ error: 'Falta el ID del usuario.' }, { status: 400 });

  if (adminUser.id === userId) return NextResponse.json({ error: 'No puedes eliminar tu propia cuenta.' }, { status: 400 });

  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: 'Usuario eliminado correctamente.' });
}