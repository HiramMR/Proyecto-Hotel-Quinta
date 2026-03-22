// ============================================================
// app/layout.tsx — Layout raíz de la aplicación (Server Component)
//
// TIPO: Server Component (no tiene 'use client')
// CUÁNDO CORRE: En el servidor. Es el primer componente que Next.js
//              renderiza para CUALQUIER página del sitio.
//
// RESPONSABILIDADES:
//   1. Definir las fuentes tipográficas (Google Fonts via next/font)
//   2. Configurar los metadatos SEO (title, description)
//   3. Envolver TODAS las páginas con el NavBar y Footer globales
//   4. Establecer el idioma del documento HTML (lang="es")
//
// JERARQUÍA:
//   layout.tsx (este archivo)
//     └── NavBar
//     └── children (cualquier página: /, /rooms, /login, etc.)
//     └── Footer
//
// POR QUÉ NO TIENE 'use client':
//   El layout es un Server Component para máxima eficiencia.
//   Los datos que necesita (fuentes, metadata) están disponibles
//   en el servidor sin necesidad de JavaScript en el navegador.
// ============================================================
import { AuthProvider } from '../lib/auth-context'
import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

// ── Fuente Display: Cormorant Garamond ──
// Se usa para títulos principales y elementos decorativos.
// variable: "--font-display" → la expone como variable CSS que puedes usar
// con `var(--font-display)` en cualquier archivo CSS o style inline.
// weight: qué variantes de peso se descargan (300=light, 700=bold, etc.)
// subsets: solo caracteres latinos para reducir el tamaño del archivo
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],  // También descarga la versión cursiva
  variable: "--font-display",
});

// ── Fuente UI: DM Sans ──
// Se usa para elementos de interfaz: botones, labels, nav, precios.
// Es más legible a tamaños pequeños que Cormorant, ideal para UI.
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-ui",
});

// ── Metadatos SEO ──
// Next.js inyecta esto automáticamente en el <head> de cada página.
// title: aparece en la pestaña del navegador y en resultados de Google
// description: snippet que muestra Google debajo del título en resultados
export const metadata: Metadata = {
  title: "Hotel Quinta Dalam",
  description: "Lujo, confort y naturaleza en el corazón de Michoacán.",
};

// ── Componente RootLayout ──
// `children` representa la página actual que Next.js está renderizando
// (ej: cuando el usuario está en /rooms, children = <RoomsPage />)
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // className en <html> expone las variables de fuentes a todo el árbol DOM.
    // Sin esto, var(--font-display) no funcionaría porque next/font crea
    // clases CSS que asignan las variables; esas clases deben estar en un
    // ancestro del elemento que las usa.
    <html lang="es" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body style={{ fontFamily: "var(--font-ui)" }}>
        <AuthProvider>
          <div className="relative z-50">
            <NavBar />
          </div>
          {children}
          <Footer />
        </AuthProvider>
    </body>
    </html>
  );
}
