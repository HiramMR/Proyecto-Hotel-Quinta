// ============================================================
// layout.tsx — Layout raíz de la aplicación (Server Component)
// Se ejecuta en el servidor. Envuelve TODAS las páginas.
// Define fuentes, metadatos SEO, el NavBar y el Footer globales.
// ============================================================

import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

// ── Fuente display: Cormorant Garamond ──
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

// ── Fuente UI: DM Sans ──
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-ui",
});

// ── Metadatos SEO ──
export const metadata: Metadata = {
  title: "Hotel Quinta Dalam",
  description: "Lujo, confort y naturaleza en el corazón de Michoacán.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body style={{ fontFamily: "var(--font-ui)" }}>
        {/* NavBar fijo — z-50 para siempre estar encima del contenido */}
        <div className="relative z-50">
          <NavBar />
        </div>
        {children}
        {/* Footer global — aparece en todas las páginas */}
        <Footer />
      </body>
    </html>
  );
}