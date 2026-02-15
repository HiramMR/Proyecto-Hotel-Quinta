import type { Metadata } from "next";
import { DM_Serif_Text } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Image from "next/image";

const dmSerif = DM_Serif_Text({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif" 
});

export const metadata: Metadata = {
  title: "Hotel Quinta Dalam",
  description: "Reserva tu estancia en el mejor hotel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={dmSerif.className}>
        {/* Global Header */}
        <header className="flex items-center justify-between p-6 bg-white shadow-sm">
          <div id="logo" className="flex items-center gap-4">
            {/* Next.js Image component for optimization */}
            <Image src="/img/favicon.png" alt="Logo" width={80} height={80} />
            <h1 className="text-3xl text-gray-800">Hotel Quinta Dalam</h1>
          </div>
          
          <nav className="flex gap-6 text-lg">
            <Link href="/" className="hover:text-blue-600 transition">Inicio</Link>
            <Link href="/rooms" className="hover:text-blue-600 transition">Habitaciones</Link>
            <Link href="/contact" className="hover:text-blue-600 transition">Contacto</Link>
            <Link href="/about" className="hover:text-blue-600 transition">Nosotros</Link>
            <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Iniciar Sesión</Link>
          </nav>
        </header>

        {children}
      </body>
    </html>
  );
}