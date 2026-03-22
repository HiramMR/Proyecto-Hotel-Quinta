// ============================================================
// lib/supabase.ts — Cliente global de Supabase
//
// Exporta una instancia del cliente que se usa en todo el proyecto
// para comunicarse con la base de datos y la autenticación.
//
// NEXT_PUBLIC_: el prefijo hace que estas variables estén
// disponibles tanto en el servidor como en el navegador.
// ============================================================

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// El signo ! le dice a TypeScript que confiamos en que
// estas variables existen (están definidas en .env.local)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)