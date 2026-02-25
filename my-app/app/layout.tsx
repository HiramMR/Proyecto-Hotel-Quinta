import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import NavBar from "./components/NavBar";

const nunito = Nunito({ 
  subsets: ["latin"],
  variable: "--font-nunito" 
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
      <body className={nunito.className}>
        {/* Global Header */}
        <NavBar />
        {children}
      </body>
    </html>
  );
}