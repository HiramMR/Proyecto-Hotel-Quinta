// ============================================================
// RoomModal.tsx — Modal expandido de habitación
//
// Cambios en esta versión:
// - Integración real con Stripe para pagos con tarjeta
// - Transferencia y efectivo siguen el flujo anterior
// - SuccessStep muestra botón para ver reservaciones
// - La reservación se marca como pagada en Supabase tras pago exitoso
// ============================================================
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Carousel from './Carousel';
import DatePicker from './DatePicker';
import { useAuth } from '../../lib/auth-context';
import { supabase } from '../../lib/supabase';

// Inicializar Stripe con la publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

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

function formatDate(dateStr: string) {
  if (!dateStr) return 'No seleccionada';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
}

function calcNights(llegada: string, salida: string): number {
  if (!llegada || !salida) return 1;
  const a = new Date(llegada + 'T00:00:00');
  const b = new Date(salida + 'T00:00:00');
  const diff = Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 1;
}

const CONFETTI = [
  { color: '#C8813A', left: '20%', delay: '0.1s',  size: 8  },
  { color: '#DDD5C5', left: '10%', delay: '0.15s', size: 9  },
  { color: '#E8A855', left: '12%', delay: '0.25s', size: 6  },
  { color: '#8B5E3C', left: '4%',  delay: '0.30s', size: 8  },
  { color: '#C8813A', left: '5%',  delay: '0.35s', size: 5  },
  { color: '#E8A855', left: '35%', delay: '0.2s',  size: 6  },
  { color: '#C8813A', left: '65%', delay: '0.3s',  size: 7  },
  { color: '#DDD5C5', left: '78%', delay: '0.15s', size: 9  },
  { color: '#E8A855', left: '12%', delay: '0.25s', size: 6  },
  { color: '#8B5E3C', left: '88%', delay: '0.08s', size: 8  },
  { color: '#C8813A', left: '55%', delay: '0.35s', size: 5  },
];

function SuccessStep({ room, llegada, salida, nights, total, metodoPago, loggedUser, formatDate, handleClose, setStep }: {
  room: Room; llegada: string; salida: string; nights: number; total: number;
  metodoPago: string;
  loggedUser: { nombre: string; correo: string };
  formatDate: (d: string) => string;
  handleClose: () => void;
  setStep: (s: 'detail' | 'booking' | 'success') => void;
}) {
  const metodoPagoLabel: Record<string, string> = {
    card: 'Tarjeta de crédito / débito',
    transfer: 'Transferencia bancaria',
    cash: 'Pago en recepción',
  }

  return (
    <div className="relative p-10 pt-14 text-center">
      <style>{`
        @keyframes checkDraw {
          from { stroke-dashoffset: 60; opacity: 0; }
          to   { stroke-dashoffset: 0;  opacity: 1; }
        }
        @keyframes ringPulse {
          0%   { transform: scale(0.5);  opacity: 0; }
          60%  { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1);    opacity: 1; }
        }
        @keyframes ringWave {
          0%   { transform: scale(1);   opacity: 0.7; }
          100% { transform: scale(2);   opacity: 0; }
        }
        @keyframes confettiFall {
          0%   { transform: translateY(-10px) rotate(0deg);   opacity: 1; }
          100% { transform: translateY(90px)  rotate(500deg); opacity: 0; }
        }
        @keyframes successSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes labelPop {
          0%   { opacity: 0; transform: scale(0.6) translateY(6px); }
          65%  { transform: scale(1.08); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      {CONFETTI.map((c, i) => (
        <div key={i} style={{
          position: 'absolute', top: '55px', left: c.left,
          width: c.size, height: c.size,
          backgroundColor: c.color, borderRadius: '2px',
          animation: `confettiFall 3s ${c.delay} ease-out both`,
          pointerEvents: 'none',
        }} />
      ))}

      <div style={{ position: 'relative', width: '96px', height: '96px', margin: '0 auto 1.5rem' }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid var(--copper)', animation: 'ringWave 1s 0.5s ease-out both' }} />
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', backgroundColor: 'rgba(200,129,58,0.1)', border: '2.5px solid var(--copper)', animation: 'ringPulse 0.65s 0.1s cubic-bezier(0.22,1,0.36,1) both' }} />
        <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round"
          style={{ position: 'absolute', inset: '16px', overflow: 'visible' }}>
          <path d="M4.5 12.75l6 6 9-13.5" stroke="var(--copper)" strokeWidth={2.5}
            style={{ strokeDasharray: 60, animation: 'checkDraw 0.6s 0.6s ease-out both' }} />
        </svg>
      </div>

      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--copper)', marginBottom: '0.75rem', animation: 'labelPop 0.55s 1s cubic-bezier(0.22,1,0.36,1) both' }}>
        ¡Reservación confirmada!
      </p>

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 400, color: 'var(--charcoal)', marginBottom: '0.5rem', animation: 'successSlideUp 0.6s 1.15s cubic-bezier(0.22,1,0.36,1) both' }}>
        Nos vemos pronto,<br /><em>{loggedUser.nombre.split(' ')[0]}</em>
      </h2>

      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--text-muted)', fontStyle: 'italic', maxWidth: '28rem', margin: '0 auto 2rem', lineHeight: 1.7, animation: 'successSlideUp 0.6s 1.3s cubic-bezier(0.22,1,0.36,1) both' }}>
        Recibirás un correo de confirmación en{' '}
        <strong style={{ color: 'var(--charcoal)' }}>{loggedUser.correo}</strong>{' '}
        con todos los detalles de tu estancia en {room.title}.
      </p>

      <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left', padding: '1.25rem', borderRadius: '12px', backgroundColor: 'var(--cream-dark)', border: '1px solid var(--stone)', minWidth: '280px', marginBottom: '2rem', animation: 'successSlideUp 0.6s 1.45s cubic-bezier(0.22,1,0.36,1) both' }}>
        <p style={{ fontFamily: 'var(--font-ui)', color: 'var(--charcoal)', fontSize: '0.9rem', fontWeight: 700 }}>{room.title}</p>
        <div style={{ height: '1px', backgroundColor: 'var(--stone)', margin: '0.25rem 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>
          <span style={{ fontFamily: 'var(--font-ui)', color: 'var(--text-muted)', fontSize: '0.75rem' }}>Check-in</span>
          <span style={{ fontFamily: 'var(--font-ui)', color: 'var(--charcoal)', fontSize: '0.75rem', fontWeight: 600 }}>{formatDate(llegada)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>
          <span style={{ fontFamily: 'var(--font-ui)', color: 'var(--text-muted)', fontSize: '0.75rem' }}>Check-out</span>
          <span style={{ fontFamily: 'var(--font-ui)', color: 'var(--charcoal)', fontSize: '0.75rem', fontWeight: 600 }}>{formatDate(salida)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>
          <span style={{ fontFamily: 'var(--font-ui)', color: 'var(--text-muted)', fontSize: '0.75rem' }}>Noches</span>
          <span style={{ fontFamily: 'var(--font-ui)', color: 'var(--charcoal)', fontSize: '0.75rem', fontWeight: 600 }}>{nights}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>
          <span style={{ fontFamily: 'var(--font-ui)', color: 'var(--text-muted)', fontSize: '0.75rem' }}>Método de pago</span>
          <span style={{ fontFamily: 'var(--font-ui)', color: 'var(--charcoal)', fontSize: '0.75rem', fontWeight: 600 }}>{metodoPagoLabel[metodoPago] ?? metodoPago}</span>
        </div>
        <div style={{ height: '1px', backgroundColor: 'var(--stone)', margin: '0.25rem 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>
          <span style={{ fontFamily: 'var(--font-ui)', color: 'var(--charcoal)', fontSize: '0.85rem', fontWeight: 700 }}>Total</span>
          <span style={{ fontFamily: 'var(--font-display)', color: 'var(--copper)', fontSize: '1.1rem', fontWeight: 700 }}>${total}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', animation: 'successSlideUp 0.6s 1.6s cubic-bezier(0.22,1,0.36,1) both' }}>
        <a href="/account?tab=reservations" className="btn-copper">
          Ver mis reservaciones
        </a>
        <button onClick={handleClose} className="btn-outline"
          style={{ color: 'var(--charcoal)', borderColor: 'var(--stone)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--cream-dark)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}>
          Volver al inicio
        </button>
      </div>
    </div>
  );
}

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
        <h4 className="font-display text-lg font-semibold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--charcoal)' }}>{room.title}</h4>
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

// ── Componente interno que usa los hooks de Stripe ──
// Debe estar dentro del provider <Elements> para funcionar
function StripePaymentForm({ clientSecret, reservationId, onSuccess, onError }: {
  clientSecret: string;
  reservationId: number;
  onSuccess: () => void;
  onError: (msg: string) => void;
}) {
  const stripe   = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);

  // ✅ handlePay es propio de este componente — no usa handleConfirm del padre
  const handlePay = async () => {
    if (!stripe || !elements) return;

    setPaying(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: 'if_required',
    });

    if (error) {
      onError(error.message ?? 'Error al procesar el pago.');
      setPaying(false);
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      await fetch('/api/confirm-reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentIntentId: paymentIntent.id, reservationId }),
      });
      onSuccess();
    }

    setPaying(false);
  };

  return (
    // ✅ Sin <form> — usamos div para evitar form anidado
    <div>
      <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: 'var(--cream-dark)', border: '1px solid var(--stone)' }}>
        <PaymentElement />
      </div>
      {/* ✅ onClick={handlePay} — llama a su propio handler */}
      <button type="button" onClick={handlePay} className="btn-copper w-full text-center"
        disabled={!stripe || paying}
        style={{ opacity: !stripe || paying ? 0.7 : 1 }}>
        {paying ? 'Procesando pago...' : 'Pagar ahora'}
      </button>
      <p className="text-xs text-center mt-3" style={{ color: 'var(--text-light)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>
        Pago seguro procesado por Stripe 🔒
      </p>
    </div>
  );
}

export default function RoomModal({ room, llegada: llegadaProp, salida: salidaProp, onClose, amenitiesList }: RoomModalProps) {
  const { user, profile } = useAuth();
  const [step, setStep] = useState<'detail' | 'booking' | 'success'>('detail');
  const [visible, setVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<'card' | 'transfer' | 'cash' | null>(null);
  const [savingError, setSavingError] = useState('');
  const [saving, setSaving] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  // ── Fechas editables desde el modal ──
  const [llegada, setLlegada] = useState(llegadaProp);
  const [salida, setSalida]   = useState(salidaProp);
  const [showLlegada, setShowLlegada] = useState(false);
  const [showSalida, setShowSalida]   = useState(false);

  const llegadaRef = useRef<HTMLDivElement>(null);
  const salidaRef  = useRef<HTMLDivElement>(null);

  const [blockedRanges, setBlockedRanges] = useState<{ from: string; to: string }[]>([]);

  useEffect(() => {
    supabase
      .from('reservations')
      .select('fecha_llegada, fecha_salida')
      .eq('room_id', room.id)
      .in('estado', ['confirmada', 'pagada'])
      .then(({ data }) => {
        setBlockedRanges(
          (data ?? []).map(r => ({ from: r.fecha_llegada, to: r.fecha_salida }))
        );
      });
  }, [room.id]);

  const nights = calcNights(llegada, salida);
  const total  = room.price * nights;
  const stars  = room.stars ?? 4;

  const loggedUser = {
    nombre: profile?.nombre
      ? `${profile.nombre} ${profile.apellido ?? ''}`.trim()
      : user?.email ?? 'Huésped',
    correo: user?.email ?? '',
  };

  const longDesc = room.longDescription ??
    `${room.description} Cada detalle de esta habitación ha sido cuidadosamente seleccionado para ofrecerte una experiencia única frente al Lago de Pátzcuaro.`;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 30);
    return () => clearTimeout(t);
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(() => onClose(), 380);
  }, [onClose]);

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

  // ✅ cardData declarado UNA sola vez
  const [cardData, setCardData] = useState({ numero: '', nombre: '', expiry: '', cvv: '' });

  const [clientSecret, setClientSecret]   = useState('');
  const [reservationId, setReservationId] = useState<number | null>(null);

  // ── Confirmar reservación para transferencia y efectivo ──
  const handleConfirm = async () => {
    if (!selectedPayment || !user || selectedPayment === 'card') return;

    setSaving(true);
    setSavingError('');

    const { error } = await supabase.from('reservations').insert({
      user_id:       user.id,
      room_id:       room.id,
      fecha_llegada: llegada,
      fecha_salida:  salida,
      noches:        nights,
      total:         total,
      metodo_pago:   selectedPayment,
      estado:        'confirmada',
    });

    if (error) {
      setSavingError('No se pudo guardar la reservación. Intenta de nuevo.');
      setSaving(false);
      return;
    }

    setSaving(false);
    setStep('success');
  };

  // ── Preparar pago con tarjeta: crear reservación + PaymentIntent ──
  const handlePrepareCardPayment = async () => {
    if (!user) return;
    setSaving(true);
    setSavingError('');

    // INSERT sin .select() para evitar que la policy SELECT (get_user_role) bloquee la operación
    const { error: resError } = await supabase
      .from('reservations')
      .insert({
        user_id:       user.id,
        room_id:       room.id,
        fecha_llegada: llegada,
        fecha_salida:  salida,
        noches:        nights,
        total:         total,
        metodo_pago:   'card',
        estado:        'confirmada',
      });

    if (resError) {
      setSavingError('No se pudo crear la reservación. Intenta de nuevo.');
      setSaving(false);
      return;
    }

    // Obtener el id de la reservación recién creada en consulta separada
    const { data: resData, error: fetchError } = await supabase
      .from('reservations')
      .select('id')
      .eq('user_id', user.id)
      .eq('room_id', room.id)
      .eq('fecha_llegada', llegada)
      .eq('fecha_salida', salida)
      .order('id', { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !resData) {
      setSavingError('No se pudo obtener la reservación. Intenta de nuevo.');
      setSaving(false);
      return;
    }

    setReservationId(resData.id);

    const res = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount:   total,
        currency: 'mxn',
        metadata: {
          reservation_id: String(resData.id),
          user_id:        user.id,
          room_id:        String(room.id),
        },
      }),
    });

    const { clientSecret: cs, error: stripeError } = await res.json();

    if (stripeError) {
      setSavingError('Error al preparar el pago. Intenta de nuevo.');
      setSaving(false);
      return;
    }

    setClientSecret(cs);
    setSaving(false);
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-8"
      style={{
        backgroundColor: visible ? 'rgba(44,36,32,0.75)' : 'rgba(44,36,32,0)',
        backdropFilter:  visible ? 'blur(6px)' : 'blur(0px)',
        transition: 'background-color 0.38s ease, backdrop-filter 0.38s ease',
      }}
      onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="relative w-full max-w-4xl"
        style={{
          backgroundColor: 'var(--cream)',
          borderRadius: '4px 28px 4px 28px',
          boxShadow: '0 32px 80px rgba(44,36,32,0.45)',
          overflow: 'hidden',
          opacity:   visible ? 1 : 0,
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.88) translateY(40px)',
          transition: 'opacity 0.45s cubic-bezier(0.22,1,0.36,1), transform 0.45s cubic-bezier(0.22,1,0.36,1)',
        }}>

        {/* Botón cerrar */}
        <button onClick={handleClose}
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
          style={{ backgroundColor: 'rgba(44,36,32,0.12)', color: 'var(--charcoal)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--charcoal)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(44,36,32,0.12)'; (e.currentTarget as HTMLElement).style.color = 'var(--charcoal)'; }}
          aria-label="Cerrar">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div style={{ maxHeight: '92vh', overflowY: 'auto' }} ref={el => { if (el) el.scrollTop = 0; }}>

          {/* ══════════════════════════════════════════
              PASO 1: DETALLE
              ══════════════════════════════════════════ */}
          {step === 'detail' && (
            <div>
              <div className="relative overflow-hidden" style={{ height: '420px', borderRadius: '4px 28px 0 0' }}>
                <Carousel images={room.images} autoSlide={true} autoSlideInterval={4000} priority
                  onImageClick={(img) => setLightboxImg(img)} />
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
                <div className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
                  style={{ background: 'linear-gradient(to top, var(--cream), transparent)' }} />
              </div>

              <div className="px-8 pb-8 pt-4">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                  <h2 className="font-display leading-tight"
                    style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 400, color: 'var(--charcoal)' }}>
                    {room.title}
                  </h2>
                  <div className="flex items-center gap-1 shrink-0 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"
                        style={{ color: i < stars ? 'var(--copper)' : 'var(--stone)' }}>
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354l-4.543 2.826c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    ))}
                    <span className="text-xs ml-1" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>{stars}/5</span>
                  </div>
                </div>

                <p className="text-sm leading-relaxed mb-6"
                  style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  {longDesc}
                </p>

                {room.amenities && room.amenities.length > 0 && (
                  <div className="mb-6">
                    <p className="text-xs uppercase tracking-widest font-semibold mb-3"
                      style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Incluye</p>
                    <div className="flex flex-wrap gap-2">
                      {room.amenities.map(name => {
                        const item = amenitiesList.find(a => a.name === name);
                        return item ? (
                          <div key={name} className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all duration-200"
                            style={{ backgroundColor: 'var(--cream-dark)', color: 'var(--charcoal)', border: '1px solid var(--stone)', fontFamily: 'var(--font-ui)' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(200,129,58,0.1)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(200,129,58,0.4)'; (e.currentTarget as HTMLElement).style.color = 'var(--copper)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--cream-dark)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--stone)'; (e.currentTarget as HTMLElement).style.color = 'var(--charcoal)'; }}>
                            {item.icon}<span>{name}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                {/* ── SELECTOR DE FECHAS CON CALENDARIO ── */}
                <div className="mb-6 p-5 rounded-xl"
                  style={{ backgroundColor: 'var(--cream-dark)', border: '1px solid var(--stone)' }}>
                  <p className="text-xs uppercase tracking-widest font-semibold mb-4"
                    style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                    Selecciona tus fechas
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div ref={llegadaRef}>
                      <p className="text-xs font-semibold uppercase tracking-widest mb-1.5"
                        style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Llegada</p>
                      <DatePicker
                        label="Fecha de llegada"
                        value={llegada}
                        onChange={v => { setLlegada(v); setShowLlegada(false); }}
                        isOpen={showLlegada}
                        onToggle={() => {
                          const opening = !showLlegada;
                          setShowLlegada(opening);
                          setShowSalida(false);
                          if (opening) setTimeout(() => llegadaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
                        }}
                        blockedRanges={blockedRanges}
                        otherDate={salida}
                        inline
                      />
                    </div>
                    <div ref={salidaRef}>
                      <p className="text-xs font-semibold uppercase tracking-widest mb-1.5"
                        style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Salida</p>
                      <DatePicker
                        label="Fecha de salida"
                        value={salida}
                        onChange={v => { setSalida(v); setShowSalida(false); }}
                        isOpen={showSalida}
                        onToggle={() => {
                          const opening = !showSalida;
                          setShowSalida(opening);
                          setShowLlegada(false);
                          if (opening) setTimeout(() => salidaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
                        }}
                        blockedRanges={blockedRanges}
                        otherDate={llegada}
                        inline
                      />
                    </div>
                  </div>
                  {llegada && salida && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-px" style={{ backgroundColor: 'var(--stone)' }} />
                      <span className="text-xs whitespace-nowrap px-2 py-0.5 rounded-full font-semibold"
                        style={{ backgroundColor: 'rgba(200,129,58,0.12)', color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>
                        {nights} {nights === 1 ? 'noche' : 'noches'}
                      </span>
                      <div className="flex-1 h-px" style={{ backgroundColor: 'var(--stone)' }} />
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4"
                  style={{ borderTop: '1px solid var(--stone)' }}>
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-display text-3xl font-semibold"
                        style={{ fontFamily: 'var(--font-display)', color: 'var(--copper)' }}>${room.price}</span>
                      <span className="text-sm" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>/ noche</span>
                    </div>
                    {nights > 1 && (
                      <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                        Total: <span className="font-semibold" style={{ color: 'var(--charcoal)' }}>${total}</span> por {nights} noches
                      </p>
                    )}
                  </div>
                  <button onClick={() => setStep('booking')} className="btn-copper" style={{ minWidth: '180px', textAlign: 'center' }}>
                    Reservar ahora
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════
              PASO 2: BOOKING
              ══════════════════════════════════════════ */}
          {step === 'booking' && (
            <div className="p-8">
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

              {/* ── SIN SESIÓN ── */}
              {!user && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                  <div className="lg:col-span-3 flex flex-col justify-center">
                    <p className="text-xs uppercase tracking-[0.25em] mb-2" style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>Paso 2 de 2</p>
                    <h2 className="font-display mb-2" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 400, color: 'var(--charcoal)' }}>
                      Identifícate para <em>continuar</em>
                    </h2>
                    <p className="text-sm mb-8 leading-relaxed" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>
                      Para completar tu reservación necesitas iniciar sesión o crear una cuenta.
                    </p>
                    <div className="space-y-3">
                      <a href="/login" className="btn-copper w-full"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        Iniciar Sesión
                      </a>
                      <a href="/register"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.9rem 2rem', border: '1.5px solid var(--stone)', borderRadius: '2px 14px 2px 14px', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: 'var(--charcoal)', transition: 'all 0.2s' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--copper)'; (e.currentTarget as HTMLElement).style.color = 'var(--copper)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--stone)'; (e.currentTarget as HTMLElement).style.color = 'var(--charcoal)'; }}>
                        Crear Cuenta
                      </a>
                    </div>
                  </div>
                  {ReservationSummary({ room, llegada, salida, nights, total, stars })}
                </div>
              )}

              {/* ── CON SESIÓN ── */}
              {user && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                  {/* ✅ <div> en lugar de <form> para evitar forms anidados */}
                  <div className="lg:col-span-3">
                    <p className="text-xs uppercase tracking-[0.25em] mb-2" style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>Paso 2 de 2</p>
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
                    </div>

                    {/* Métodos de pago */}
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

                    {/* ── TARJETA: Formulario real de Stripe ── */}
                    {selectedPayment === 'card' && (
                      <div className="mb-4">
                        {!clientSecret ? (
                          <button type="button" onClick={handlePrepareCardPayment}
                            className="btn-copper w-full text-center"
                            disabled={saving}
                            style={{ opacity: saving ? 0.7 : 1 }}>
                            {saving ? 'Preparando pago...' : 'Continuar con tarjeta →'}
                          </button>
                        ) : (
                          <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe', variables: { colorPrimary: '#C8813A', borderRadius: '8px' } } }}>
                            <StripePaymentForm
                              clientSecret={clientSecret}
                              reservationId={reservationId!}
                              onSuccess={() => setStep('success')}
                              onError={(msg) => setSavingError(msg)}
                            />
                          </Elements>
                        )}
                      </div>
                    )}

                    {/* Info transferencia */}
                    {selectedPayment === 'transfer' && (
                      <div className="p-4 rounded-lg mb-4 space-y-2" style={{ backgroundColor: 'var(--cream-dark)', border: '1px solid var(--stone)' }}>
                        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Datos bancarios</p>
                        {[
                          { l: 'Banco',        v: 'BBVA México' },
                          { l: 'Cuenta',       v: '0123 4567 89' },
                          { l: 'CLABE',        v: '012 345 678 901 234 5' },
                          { l: 'Beneficiario', v: 'Hotel Quinta Dalam S.A.' },
                          { l: 'Referencia',   v: `RES-${room.id}-${Date.now().toString().slice(-6)}` },
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
                      <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: 'rgba(200,129,58,0.06)', border: '1px solid rgba(200,129,58,0.2)' }}>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>
                          Puedes pagar en efectivo o con tarjeta directamente en la recepción del hotel al momento del check-in.
                        </p>
                      </div>
                    )}

                    {/* Error al guardar */}
                    {savingError && (
                      <div className="p-3 rounded-lg text-sm mb-3"
                        style={{ backgroundColor: 'rgba(200,60,60,0.08)', border: '1px solid rgba(200,60,60,0.2)', color: '#c03c3c', fontFamily: 'var(--font-ui)' }}>
                        {savingError}
                      </div>
                    )}

                    {/* ✅ Botón confirmar — onClick en lugar de type="submit" */}
                    {selectedPayment !== 'card' && (
                      <button type="button" onClick={handleConfirm}
                        className="btn-copper w-full text-center mt-2"
                        style={{ opacity: selectedPayment && !saving ? 1 : 0.5, transition: 'opacity 0.2s' }}
                        disabled={!selectedPayment || saving}>
                        {saving ? 'Guardando reservación...' : 'Confirmar reservación'}
                      </button>
                    )}

                    <p className="text-xs text-center mt-3" style={{ color: 'var(--text-light)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>
                      Cancelación gratuita hasta 48 horas antes del check-in.
                    </p>
                  </div>

                  {ReservationSummary({ room, llegada, salida, nights, total, stars })}
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════
              PASO 3: CONFIRMACIÓN
              ══════════════════════════════════════════ */}
          {step === 'success' && (
            <SuccessStep
              room={room} llegada={llegada} salida={salida}
              nights={nights} total={total}
              metodoPago={selectedPayment ?? 'card'}
              loggedUser={loggedUser}
              formatDate={formatDate}
              handleClose={handleClose}
              setStep={setStep}
            />
          )}
        </div>
      </div>

      {/* ── LIGHTBOX ── */}
      {lightboxImg && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-6"
          style={{ backgroundColor: 'rgba(20,14,12,0.92)', backdropFilter: 'blur(10px)', animation: 'fadeIn 0.25s ease both' }}
          onClick={() => setLightboxImg(null)}>
          <div className="relative max-w-4xl w-full" style={{ animation: 'scaleIn 0.3s cubic-bezier(0.22,1,0.36,1) both' }}
            onClick={e => e.stopPropagation()}>
            <img src={lightboxImg} alt="" className="w-full object-contain rounded-2xl"
              style={{ maxHeight: '82vh', boxShadow: '0 32px 80px rgba(0,0,0,0.7)' }} />
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