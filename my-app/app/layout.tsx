// ============================================================
// layout.tsx — Layout raíz de la aplicación (Server Component)
// Se ejecuta en el servidor. Envuelve TODAS las páginas.
// Define fuentes, metadatos SEO y el NavBar global.
// ============================================================

import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import NavBar from "./components/NavBar";

// ── Fuente display: Cormorant Garamond ──
// Se usa para títulos y encabezados. Disponible como variable CSS: --font-display
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],  // Necesitamos la versión itálica para los <em>
  variable: "--font-display",
});

// ── Fuente UI: DM Sans ──
// Se usa para botones, etiquetas, navegación. Variable CSS: --font-ui
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-ui",
});

// ── Metadatos SEO ──
// Next.js los inyecta automáticamente en el <head> de cada página
export const metadata: Metadata = {
  title: "Hotel Quinta Dalam",
  description: "Lujo, confort y naturaleza en el corazón de Michoacán.",
};

// ── RootLayout ──
// Recibe `children` que representa el contenido de la página activa.
// Las variables de fuente se aplican al <html> para que estén disponibles
// en todo el árbol de componentes via CSS variables.
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body style={{ fontFamily: "var(--font-ui)" }}>
        {/* NavBar va en un div con z-50 para siempre estar encima del contenido */}
        <div className="relative z-50">
          <NavBar />
        </div>
        {children}
      </body>
    </html>
  );
}