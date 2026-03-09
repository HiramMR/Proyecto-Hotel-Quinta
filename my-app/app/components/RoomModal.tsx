// ============================================================
// RoomModal.tsx — Modal expandido de habitación
//
// Se abre al hacer clic en "Reservar" desde cualquier RoomCard.
// Animación: el modal crece desde el centro con scale + fade.
// Fondo: overlay oscuro semitransparente con blur.
//
// Flujo de estados:
//   'detail'  → Vista principal de la habitación
//   'booking' → Formulario para confirmar reserva
//   'success' → Pantalla de confirmación final
//
// Props:
//   room       — datos de la habitación seleccionada
//   llegada    — fecha de llegada ya seleccionada (del buscador)
//   salida     — fecha de salida ya seleccionada
//   onClose    — cierra el modal
//   amenitiesList — catálogo completo para mostrar íconos
// ============================================================
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Carousel from './Carousel';

interface AmenityItem { name: string; icon: React.ReactNode; }

interface Room {
  id: number;
  title: string;
  description: string;
  longDescription?: string;
  price: number;
  images: string[];
  capacity: number;
  popular?: boolean;
  stars?: number;
  amenities?: string[];
}

interface RoomModalProps {
  room: Room;
  llegada: string;
  salida: string;
  onClose: () => void;
  amenitiesList: AmenityItem[];
}

// ── Formato legible de fecha "YYYY-MM-DD" → "15 de enero de 2025" ──
function formatDate(dateStr: string) {
  if (!dateStr) return 'No seleccionada';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ── Calcular número de noches entre dos fechas ──
function calcNights(llegada: string, salida: string): number {
  if (!llegada || !salida) return 1;
  const a = new Date(llegada + 'T00:00:00');
  const b = new Date(salida + 'T00:00:00');
  const diff = Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 1;
}

// ── Componente reutilizable: resumen de reserva (columna derecha del paso 2) ──
function ReservationSummary({ room, llegada, salida, nights, total, stars }: {
  room: Room; llegada: string; salida: string; nights: number; total: number; stars: number;
}) {
  return (
    <div className="lg:col-span-2">
      <div className="p-5 rounded-xl sticky top-4" style={{ backgroundColor: 'var(--cream-dark)', border: '1px solid var(--stone)' }}>
        <div className="relative h-36 rounded-lg overflow-hidden mb-4">
          <Image src={room.images[0]} alt={room.title} fill className="object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(44,36,32,0.5), transparent)' }} />
        </div>
        <h4 className="font-display text-lg font-semibold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--charcoal)' }}>
          {room.title}
        </h4>
        <div className="flex gap-0.5 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"
              style={{ color: i < stars ? 'var(--copper)' : 'var(--stone)' }}>
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354l-4.543 2.826c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
            </svg>
          ))}
        </div>
        <div className="space-y-2 text-xs" style={{ fontFamily: 'var(--font-ui)' }}>
          <div className="flex justify-between">
            <span style={{ color: 'var(--text-muted)' }}>Check-in</span>
            <span className="font-semibold" style={{ color: 'var(--charcoal)' }}>{formatDate(llegada)}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'var(--text-muted)' }}>Check-out</span>
            <span className="font-semibold" style={{ color: 'var(--charcoal)' }}>{formatDate(salida)}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'var(--text-muted)' }}>Noches</span>
            <span className="font-semibold" style={{ color: 'var(--charcoal)' }}>{nights}</span>
          </div>
          <div className="h-px my-2" style={{ backgroundColor: 'var(--stone)' }} />
          <div className="flex justify-between">
            <span style={{ color: 'var(--text-muted)' }}>${room.price} × {nights} noches</span>
            <span className="font-semibold" style={{ color: 'var(--charcoal)' }}>${total}</span>
          </div>
          <div className="flex justify-between text-sm font-bold pt-1">
            <span style={{ color: 'var(--charcoal)' }}>Total</span>
            <span style={{ color: 'var(--copper)', fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>${total}</span>
          </div>
        </div>
        <p className="text-xs mt-4 leading-relaxed" style={{ color: 'var(--text-light)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>
          Cancelación gratuita hasta 48 horas antes del check-in.
        </p>
      </div>
    </div>
  );
}

export default function RoomModal({ room, llegada, salida, onClose, amenitiesList }: RoomModalProps) {
  // 'detail' | 'booking' | 'success'
  const [step, setStep] = useState<'detail' | 'booking' | 'success'>('detail');

  // Animación de entrada del modal
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 30);
    return () => clearTimeout(t);
  }, []);

  // Simulación de sesión — en producción esto vendrá de NextAuth/contexto de auth
  // Para demo: el botón "Ya tengo cuenta" en el paso 2 activa isLoggedIn
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const loggedUser = { nombre: 'Ana García', correo: 'ana@correo.com' }; // datos de prueba

  // Método de pago seleccionado
  const [selectedPayment, setSelectedPayment] = useState<'card' | 'transfer' | 'cash' | null>(null);
  const [cardData, setCardData] = useState({ numero: '', nombre: '', expiry: '', cvv: '' });

  const nights = calcNights(llegada, salida);
  const total = room.price * nights;
  const stars = room.stars ?? 4;

  const longDesc = room.longDescription ??
    `${room.description} Cada detalle de esta habitación ha sido cuidadosamente seleccionado para ofrecerte una experiencia única frente al Lago de Pátzcuaro. Disfruta de la tranquilidad michoacana con todos los servicios de un hotel boutique de lujo, desde el amanecer sobre el agua hasta las noches iluminadas por las estrellas del cielo purépecha.`;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayment) return;
    setStep('success');
  };

  // ── Lightbox de foto ──
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  // ── Animación de salida: primero animar, luego llamar onClose real ──
  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(() => onClose(), 380); // espera a que termine la animación
  }, [onClose]);

  // Reemplazar onClose con handleClose en los listeners
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxImg) { setLightboxImg(null); return; }
        handleClose();
      }
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleClose, lightboxImg]);

  return (
    // ── OVERLAY ──
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      style={{
        backgroundColor: visible ? 'rgba(44,36,32,0.75)' : 'rgba(44,36,32,0)',
        backdropFilter: visible ? 'blur(6px)' : 'blur(0px)',
        transition: 'background-color 0.38s ease, backdrop-filter 0.38s ease',
      }}
      onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
    >
      {/* ── PANEL MODAL ──
          overflow: hidden aquí para que el border-radius recorte TODO el contenido,
          incluyendo la scrollbar. El scroll real va en el div interior. ── */}
      <div
        className="relative w-full max-w-4xl"
        style={{
          backgroundColor: 'var(--cream)',
          borderRadius: '4px 28px 4px 28px',
          boxShadow: '0 32px 80px rgba(44,36,32,0.45)',
          overflow: 'hidden',           // ← recorta scrollbar dentro del border-radius
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.88) translateY(40px)',
          transition: 'opacity 0.45s cubic-bezier(0.22,1,0.36,1), transform 0.45s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {/* ── BOTÓN CERRAR — en el panel externo, siempre visible en la esquina ── */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
          style={{ backgroundColor: 'rgba(44,36,32,0.12)', color: 'var(--charcoal)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--charcoal)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(44,36,32,0.12)'; (e.currentTarget as HTMLElement).style.color = 'var(--charcoal)'; }}
          aria-label="Cerrar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Div interior scrolleable — la scrollbar aparece aquí, dentro del recorte */}
        <div style={{ maxHeight: '92vh', overflowY: 'auto' }}>

        {/* ══════════════════════════════════════════
            PASO 1: DETALLE DE LA HABITACIÓN
            ══════════════════════════════════════════ */}
        {step === 'detail' && (
          <div>
            {/* Carrusel grande */}
            <div className="relative overflow-hidden" style={{ height: '420px', borderRadius: '4px 28px 0 0' }}>
              <Carousel images={room.images} autoSlide={true} autoSlideInterval={4000} priority
                onImageClick={(img) => setLightboxImg(img)} />

              {/* Badges sobre el carrusel */}
              <div className="absolute top-4 left-4 flex gap-2 z-10">
                {room.popular && (
                  <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wide rounded-full"
                    style={{ backgroundColor: 'var(--copper)', color: '#fff', fontFamily: 'var(--font-ui)' }}>
                    Popular
                  </span>
                )}
                {room.capacity && (
                  <span className="px-3 py-1 text-xs font-semibold flex items-center gap-1 rounded-full"
                    style={{ backgroundColor: 'rgba(245,240,232,0.18)', backdropFilter: 'blur(8px)', color: '#fff', border: '1px solid rgba(245,240,232,0.3)' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                    </svg>
                    Hasta {room.capacity} huéspedes
                  </span>
                )}
              </div>

              {/* Gradiente para transición al contenido */}
              <div className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
                style={{ background: 'linear-gradient(to top, var(--cream), transparent)' }} />
            </div>

            {/* Contenido del detalle */}
            <div className="px-8 pb-8 pt-4">
              {/* Nombre + estrellas */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                <h2 className="font-display leading-tight"
                  style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 400, color: 'var(--charcoal)' }}>
                  {room.title}
                </h2>
                {/* Estrellas */}
                <div className="flex items-center gap-1 shrink-0 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                      className="w-4 h-4"
                      style={{ color: i < stars ? 'var(--copper)' : 'var(--stone)' }}>
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354l-4.543 2.826c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  ))}
                  <span className="text-xs ml-1" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                    {stars}/5
                  </span>
                </div>
              </div>

              {/* Descripción larga */}
              <p className="text-sm leading-relaxed mb-6"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                {longDesc}
              </p>

              {/* Amenidades completas */}
              {room.amenities && room.amenities.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs uppercase tracking-widest font-semibold mb-3"
                    style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                    Incluye
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.map(name => {
                      const item = amenitiesList.find(a => a.name === name);
                      return item ? (
                        <div key={name} className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all duration-200"
                          style={{ backgroundColor: 'var(--cream-dark)', color: 'var(--charcoal)', border: '1px solid var(--stone)', fontFamily: 'var(--font-ui)' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(200,129,58,0.1)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(200,129,58,0.4)'; (e.currentTarget as HTMLElement).style.color = 'var(--copper)'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--cream-dark)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--stone)'; (e.currentTarget as HTMLElement).style.color = 'var(--charcoal)'; }}>
                          {item.icon}
                          <span>{name}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {/* Fechas + precio en panel */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 p-5 rounded-xl"
                style={{ backgroundColor: 'var(--cream-dark)', border: '1px solid var(--stone)' }}>
                {/* Llegada */}
                <div className="text-center">
                  <p className="text-xs uppercase tracking-widest font-semibold mb-1"
                    style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Llegada</p>
                  <p className="text-sm font-semibold" style={{ color: llegada ? 'var(--charcoal)' : 'var(--text-light)', fontFamily: 'var(--font-ui)' }}>
                    {formatDate(llegada)}
                  </p>
                </div>
                {/* Divider + noches */}
                <div className="flex flex-col items-center justify-center">
                  <div className="flex items-center gap-2 w-full">
                    <div className="flex-1 h-px" style={{ backgroundColor: 'var(--stone)' }} />
                    <span className="text-xs whitespace-nowrap px-2 py-0.5 rounded-full font-semibold"
                      style={{ backgroundColor: 'rgba(200,129,58,0.12)', color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>
                      {nights} {nights === 1 ? 'noche' : 'noches'}
                    </span>
                    <div className="flex-1 h-px" style={{ backgroundColor: 'var(--stone)' }} />
                  </div>
                </div>
                {/* Salida */}
                <div className="text-center">
                  <p className="text-xs uppercase tracking-widest font-semibold mb-1"
                    style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Salida</p>
                  <p className="text-sm font-semibold" style={{ color: salida ? 'var(--charcoal)' : 'var(--text-light)', fontFamily: 'var(--font-ui)' }}>
                    {formatDate(salida)}
                  </p>
                </div>
              </div>

              {/* Precio total + botón Reservar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4"
                style={{ borderTop: '1px solid var(--stone)' }}>
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display text-3xl font-semibold"
                      style={{ fontFamily: 'var(--font-display)', color: 'var(--copper)' }}>
                      ${room.price}
                    </span>
                    <span className="text-sm" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>/ noche</span>
                  </div>
                  {nights > 1 && (
                    <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                      Total: <span className="font-semibold" style={{ color: 'var(--charcoal)' }}>${total}</span> por {nights} noches
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setStep('booking')}
                  className="btn-copper"
                  style={{ minWidth: '180px', textAlign: 'center' }}>
                  Reservar ahora
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            PASO 2: SESIÓN → PAGO
            Si no hay sesión: pedir login/registro.
            Si hay sesión: mostrar método de pago + resumen.
            ══════════════════════════════════════════ */}
        {step === 'booking' && (
          <div className="p-8">
            {/* Botón volver */}
            <button onClick={() => setStep('detail')}
              className="flex items-center gap-2 text-xs mb-6 transition-colors"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--copper)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Volver al detalle
            </button>

            {/* ── SIN SESIÓN: pedir login/registro ── */}
            {!isLoggedIn && (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Lado izquierdo: CTA de sesión */}
                <div className="lg:col-span-3 flex flex-col justify-center">
                  <p className="text-xs uppercase tracking-[0.25em] mb-2" style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>
                    Paso 2 de 2
                  </p>
                  <h2 className="font-display mb-2" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 400, color: 'var(--charcoal)' }}>
                    Identifícate para <em>continuar</em>
                  </h2>
                  <p className="text-sm mb-8 leading-relaxed" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>
                    Para completar tu reservación necesitas iniciar sesión o crear una cuenta. Es rápido y te permite gestionar tus estadías.
                  </p>

                  <div className="space-y-3">
                    {/* Botón principal: Iniciar sesión */}
                    <a href="/login"
                      className="btn-copper w-full"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '1rem', height: '1rem', flexShrink: 0 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                      </svg>
                      <span>Iniciar Sesión</span>
                    </a>

                    {/* Botón secundario: Crear cuenta */}
                    <a href="/register"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.9rem 2rem', border: '1.5px solid var(--stone)', borderRadius: '2px 14px 2px 14px', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: 'var(--charcoal)', transition: 'all 0.2s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--copper)'; (e.currentTarget as HTMLElement).style.color = 'var(--copper)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--stone)'; (e.currentTarget as HTMLElement).style.color = 'var(--charcoal)'; }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '1rem', height: '1rem', flexShrink: 0 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                      </svg>
                      <span>Crear Cuenta</span>
                    </a>
                  </div>

                  {/* Separador */}
                  <div className="flex items-center gap-4 my-5">
                    <div className="flex-1 h-px" style={{ backgroundColor: 'var(--stone)' }} />
                    <span className="text-xs" style={{ color: 'var(--text-light)', fontFamily: 'var(--font-ui)' }}>o para demo</span>
                    <div className="flex-1 h-px" style={{ backgroundColor: 'var(--stone)' }} />
                  </div>

                  {/* Demo: simular que ya tiene sesión */}
                  <button
                    onClick={() => setIsLoggedIn(true)}
                    className="text-xs underline underline-offset-2 text-center transition-colors"
                    style={{ color: 'var(--text-light)', fontFamily: 'var(--font-ui)' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--copper)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-light)'}>
                    Continuar como Ana García (demo)
                  </button>
                </div>

                {/* Resumen de la reserva (lado derecho — siempre visible) */}
                {ReservationSummary({ room, llegada, salida, nights, total, stars })}
              </div>
            )}

            {/* ── CON SESIÓN: método de pago ── */}
            {isLoggedIn && (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Lado izquierdo: método de pago */}
                <form className="lg:col-span-3" onSubmit={handleConfirm}>
                  <p className="text-xs uppercase tracking-[0.25em] mb-2" style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>
                    Paso 2 de 2
                  </p>
                  <h2 className="font-display mb-1" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 400, color: 'var(--charcoal)' }}>
                    Método de <em>pago</em>
                  </h2>

                  {/* Usuario identificado */}
                  <div className="flex items-center gap-3 mb-6 mt-3 p-3 rounded-lg"
                    style={{ backgroundColor: 'rgba(200,129,58,0.07)', border: '1px solid rgba(200,129,58,0.2)' }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ backgroundColor: 'var(--copper)', color: '#fff', fontFamily: 'var(--font-display)', fontSize: '1rem' }}>
                      {loggedUser.nombre.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold" style={{ color: 'var(--charcoal)', fontFamily: 'var(--font-ui)' }}>{loggedUser.nombre}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>{loggedUser.correo}</p>
                    </div>
                    <button type="button" onClick={() => setIsLoggedIn(false)}
                      className="ml-auto text-xs transition-colors"
                      style={{ color: 'var(--text-light)', fontFamily: 'var(--font-ui)' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--copper)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-light)'}>
                      Cambiar
                    </button>
                  </div>

                  {/* Opciones de método de pago */}
                  <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                    Selecciona un método
                  </p>
                  <div className="space-y-2 mb-5">
                    {[
                      { id: 'card',     label: 'Tarjeta de crédito / débito', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg> },
                      { id: 'transfer', label: 'Transferencia bancaria',      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75" /></svg> },
                      { id: 'cash',     label: 'Pago en recepción al llegar', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33" /></svg> },
                    ].map(opt => (
                      <button key={opt.id} type="button"
                        onClick={() => setSelectedPayment(opt.id as 'card' | 'transfer' | 'cash')}
                        className="w-full flex items-center gap-3 p-3.5 rounded-lg text-sm text-left transition-all duration-200"
                        style={{
                          border: `1.5px solid ${selectedPayment === opt.id ? 'var(--copper)' : 'var(--stone)'}`,
                          backgroundColor: selectedPayment === opt.id ? 'rgba(200,129,58,0.06)' : 'transparent',
                          color: selectedPayment === opt.id ? 'var(--copper)' : 'var(--charcoal)',
                          fontFamily: 'var(--font-ui)',
                        }}>
                        {/* Radio visual */}
                        <div className="w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-all"
                          style={{ borderColor: selectedPayment === opt.id ? 'var(--copper)' : 'var(--stone)' }}>
                          {selectedPayment === opt.id && (
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--copper)' }} />
                          )}
                        </div>
                        <span style={{ color: 'var(--text-muted)' }}>{opt.icon}</span>
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {/* Campos de tarjeta — solo si seleccionó "card" */}
                  {selectedPayment === 'card' && (
                    <div className="space-y-3 p-4 rounded-lg mb-4 transition-all"
                      style={{ backgroundColor: 'var(--cream-dark)', border: '1px solid var(--stone)' }}>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Número de tarjeta</label>
                        <input type="text" maxLength={19} className="input-warm" placeholder="1234 5678 9012 3456"
                          value={cardData.numero}
                          onChange={e => {
                            // Formatear con espacios cada 4 dígitos
                            const v = e.target.value.replace(/\D/g, '').substring(0, 16);
                            const fmt = v.replace(/(.{4})/g, '$1 ').trim();
                            setCardData(d => ({ ...d, numero: fmt }));
                          }} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Nombre en la tarjeta</label>
                        <input type="text" className="input-warm" placeholder="ANA GARCIA"
                          value={cardData.nombre} onChange={e => setCardData(d => ({ ...d, nombre: e.target.value.toUpperCase() }))} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Vencimiento</label>
                          <input type="text" maxLength={5} className="input-warm" placeholder="MM/AA"
                            value={cardData.expiry}
                            onChange={e => {
                              const v = e.target.value.replace(/\D/g, '').substring(0, 4);
                              const fmt = v.length > 2 ? `${v.substring(0,2)}/${v.substring(2)}` : v;
                              setCardData(d => ({ ...d, expiry: fmt }));
                            }} />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>CVV</label>
                          <input type="password" maxLength={4} className="input-warm" placeholder="•••"
                            value={cardData.cvv} onChange={e => setCardData(d => ({ ...d, cvv: e.target.value.replace(/\D/g, '').substring(0,4) }))} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Info de transferencia */}
                  {selectedPayment === 'transfer' && (
                    <div className="p-4 rounded-lg mb-4 space-y-2"
                      style={{ backgroundColor: 'var(--cream-dark)', border: '1px solid var(--stone)' }}>
                      <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Datos bancarios</p>
                      {[
                        { l: 'Banco', v: 'BBVA México' },
                        { l: 'Cuenta', v: '0123 4567 89' },
                        { l: 'CLABE', v: '012 345 678 901 234 5' },
                        { l: 'Beneficiario', v: 'Hotel Quinta Dalam S.A.' },
                        { l: 'Referencia', v: `RES-${room.id}-${Date.now().toString().slice(-6)}` },
                      ].map(item => (
                        <div key={item.l} className="flex justify-between text-xs" style={{ fontFamily: 'var(--font-ui)' }}>
                          <span style={{ color: 'var(--text-muted)' }}>{item.l}</span>
                          <span className="font-semibold" style={{ color: 'var(--charcoal)' }}>{item.v}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Info pago en recepción */}
                  {selectedPayment === 'cash' && (
                    <div className="p-4 rounded-lg mb-4"
                      style={{ backgroundColor: 'rgba(200,129,58,0.06)', border: '1px solid rgba(200,129,58,0.2)' }}>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>
                        Puedes pagar en efectivo o con tarjeta directamente en la recepción del hotel al momento del check-in. Tu reservación quedará confirmada de inmediato.
                      </p>
                    </div>
                  )}

                  <button type="submit"
                    className="btn-copper w-full text-center mt-2"
                    style={{ opacity: selectedPayment ? 1 : 0.5, transition: 'opacity 0.2s' }}
                    disabled={!selectedPayment}>
                    Confirmar reservación
                  </button>

                  <p className="text-xs text-center mt-3" style={{ color: 'var(--text-light)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>
                    Cancelación gratuita hasta 48 horas antes del check-in.
                  </p>
                </form>

                {/* Resumen de la reserva (lado derecho) */}
                {ReservationSummary({ room, llegada, salida, nights, total, stars })}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════
            PASO 3: CONFIRMACIÓN FINAL
            ══════════════════════════════════════════ */}
        {step === 'success' && (
          <div className="p-10 text-center">
            {/* Ícono de check animado */}
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: 'rgba(200,129,58,0.12)', border: '2px solid var(--copper)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"
                className="w-10 h-10" style={{ color: 'var(--copper)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <p className="text-xs uppercase tracking-[0.3em] mb-3" style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>
              ¡Reservación confirmada!
            </p>
            <h2 className="font-display mb-2" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 400, color: 'var(--charcoal)' }}>
              Nos vemos pronto,<br /><em>{loggedUser.nombre.split(' ')[0]}</em>
            </h2>
            <p className="text-sm leading-relaxed max-w-md mx-auto mb-8"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              Recibirás un correo de confirmación en <strong style={{ color: 'var(--charcoal)' }}>{loggedUser.correo}</strong> con todos los detalles de tu estancia en {room.title}.
            </p>
            {/* Resumen compacto */}
            <div className="inline-flex flex-col gap-2 text-sm p-5 rounded-xl mb-8 text-left"
              style={{ backgroundColor: 'var(--cream-dark)', border: '1px solid var(--stone)', minWidth: '260px' }}>
              <p style={{ fontFamily: 'var(--font-ui)', color: 'var(--charcoal)' }}><strong>{room.title}</strong></p>
              <p style={{ fontFamily: 'var(--font-ui)', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                {formatDate(llegada)} → {formatDate(salida)}
              </p>
              <p style={{ fontFamily: 'var(--font-ui)', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                {nights} {nights === 1 ? 'noche' : 'noches'} · Total:{' '}
                <span style={{ color: 'var(--copper)', fontWeight: 700 }}>${total}</span>
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={handleClose} className="btn-copper">
                Volver al inicio
              </button>
              <button onClick={() => setStep('detail')}
                className="btn-outline"
                style={{ color: 'var(--charcoal)', borderColor: 'var(--stone)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--cream-dark)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}>
                Ver habitación
              </button>
            </div>
          </div>
        )}
        </div>{/* ← cierre del div interior scrolleable */}
      </div>

      {/* ── LIGHTBOX — foto ampliada al hacer clic en el carrusel ── */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-6"
          style={{ backgroundColor: 'rgba(20,14,12,0.92)', backdropFilter: 'blur(10px)', animation: 'fadeIn 0.25s ease both' }}
          onClick={() => setLightboxImg(null)}>
          <div className="relative max-w-4xl w-full" style={{ animation: 'scaleIn 0.3s cubic-bezier(0.22,1,0.36,1) both' }}
            onClick={e => e.stopPropagation()}>
            <img src={lightboxImg} alt="" className="w-full object-contain rounded-2xl"
              style={{ maxHeight: '82vh', boxShadow: '0 32px 80px rgba(0,0,0,0.7)' }} />
            {/* Miniaturas de las otras fotos */}
            {room.images.length > 1 && (
              <div className="flex gap-2 mt-3 justify-center flex-wrap">
                {room.images.map((img, i) => (
                  <button key={i} onClick={() => setLightboxImg(img)}
                    className="rounded-lg overflow-hidden transition-all duration-150"
                    style={{ width: '64px', height: '48px', position: 'relative', opacity: lightboxImg === img ? 1 : 0.55, outline: lightboxImg === img ? '2px solid var(--copper)' : 'none', outlineOffset: '2px' }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Botón cerrar lightbox */}
          <button onClick={() => setLightboxImg(null)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
            style={{ backgroundColor: 'rgba(245,240,232,0.15)', color: '#fff' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(245,240,232,0.28)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(245,240,232,0.15)'}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

/* Keyframes para el lightbox */
const _lightboxStyles = `
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.9); }
    to   { opacity: 1; transform: scale(1); }
  }
`;