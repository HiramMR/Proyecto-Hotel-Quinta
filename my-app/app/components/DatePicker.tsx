// ============================================================
// DatePicker.tsx — Calendario personalizado (Client Component)
//
// Cambios en esta versión:
// - Nueva prop `blockedRanges`: array de rangos { from, to } con
//   fechas bloqueadas por reservaciones existentes.
//   Los días bloqueados aparecen tachados en gris y no se pueden seleccionar.
// ============================================================
'use client';

import { useState } from 'react';

interface BlockedRange {
  from: string; // "YYYY-MM-DD"
  to: string;   // "YYYY-MM-DD"
}

interface DatePickerProps {
  label: string;
  value: string;
  onChange: (date: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  blockedRanges?: BlockedRange[];
  otherDate?: string;
  inline?: boolean; // Si true, el calendario empuja el contenido en lugar de flotar
}

const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DAYS   = ['Do','Lu','Ma','Mi','Ju','Vi','Sá'];

export default function DatePicker({ label, value, onChange, isOpen, onToggle, blockedRanges = [], otherDate = '', inline = false }: DatePickerProps) {
  const today = new Date();
  const [viewYear, setViewYear]   = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const selected = value ? new Date(value + 'T00:00:00') : null;

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const firstDay    = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const isToday = (d: number) =>
    d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  const isSelected = (d: number) =>
    selected !== null &&
    d === selected.getDate() &&
    viewMonth === selected.getMonth() &&
    viewYear === selected.getFullYear();

  const isPast = (d: number) => {
    const date         = new Date(viewYear, viewMonth, d);
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return date < todayMidnight;
  };

  // ── Verificar si un día está bloqueado ──
  // Un día está bloqueado si:
  // 1. Cae DENTRO de un rango bloqueado (entre llegada y salida de una reservación)
  // 2. Elegirlo como llegada causaría traslape con una reservación existente
  //    (es decir, si la salida ya seleccionada es posterior a la llegada de alguna reservación)
  const isBlocked = (d: number) => {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    return blockedRanges.some(range => {
      // El día cae dentro del rango reservado (entre llegada inclusive y salida exclusive)
      return dateStr >= range.from && dateStr < range.to;
    });
  };

  // ── Verificar si elegir este día causaría traslape con una reservación ──
  // Usamos otherDate (la fecha del otro picker) para verificar si el rango
  // entre este día y otherDate cruza alguna reservación existente.
  // Ejemplo: si este es el picker de llegada y otherDate es la salida,
  // bloqueamos los días de llegada que harían que el rango llegada→salida
  // cruce una reservación confirmada.
  const wouldOverlap = (d: number) => {
    if (!otherDate) return false;
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const rangeStart = dateStr < otherDate ? dateStr : otherDate;
    const rangeEnd   = dateStr < otherDate ? otherDate : dateStr;
    return blockedRanges.some(range =>
      rangeStart < range.to && rangeEnd > range.from
    );
  };

  const handleSelect = (d: number) => {
    if (isPast(d) || isBlocked(d) || wouldOverlap(d)) return;
    const month = String(viewMonth + 1).padStart(2, '0');
    const day   = String(d).padStart(2, '0');
    onChange(`${viewYear}-${month}-${day}`);
  };

  const formatDisplay = () => {
    if (!selected) return label;
    return selected.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="relative w-full">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 transition-colors"
        style={{
          padding: '0.75rem 1.25rem',
          border: `1px solid ${isOpen ? 'var(--copper)' : 'var(--stone)'}`,
          borderRadius: '8px',
          backgroundColor: isOpen ? 'rgba(200,129,58,0.05)' : 'var(--cream)',
          color: value ? 'var(--charcoal)' : 'var(--text-muted)',
          fontFamily: 'var(--font-ui)',
          fontSize: '0.85rem',
          textAlign: 'left',
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
          className="w-4 h-4 shrink-0" style={{ color: 'var(--copper)' }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
        <span>{formatDisplay()}</span>
      </button>

      {isOpen && (
        <div
          className={`${inline ? 'relative mt-2' : 'absolute top-full left-0 mt-2'} select-none`}
          style={{
            backgroundColor: 'var(--cream)',
            border: '1px solid var(--stone)',
            borderRadius: '4px 16px 4px 16px',
            boxShadow: '0 20px 60px rgba(44,36,32,0.18)',
            zIndex: inline ? 'auto' : 9999,
            width: inline ? '100%' : '17rem',
            padding: '1rem',
          }}
        >
          {/* Leyenda de fechas bloqueadas */}
          {blockedRanges.length > 0 && (
            <div className="flex items-center gap-2 mb-3 pb-3" style={{ borderBottom: '1px solid var(--stone)' }}>
              <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'rgba(44,36,32,0.06)' }}>
                <span style={{ fontSize: '0.5rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>15</span>
              </div>
              <span className="text-xs" style={{ color: 'var(--text-light)', fontFamily: 'var(--font-ui)' }}>
                Fechas no disponibles
              </span>
            </div>
          )}

          {/* Encabezado con navegación de mes */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-1 rounded-full transition-colors"
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--stone)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4" style={{ color: 'var(--charcoal)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <span className="text-sm font-semibold uppercase tracking-widest" style={{ fontFamily: 'var(--font-ui)', color: 'var(--charcoal)' }}>
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button onClick={nextMonth} className="p-1 rounded-full transition-colors"
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--stone)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4" style={{ color: 'var(--charcoal)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>

          {/* Cabecera días de la semana */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map(d => (
              <div key={d} className="text-center text-xs font-semibold py-1"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Cuadrícula de días */}
          <div className="grid grid-cols-7 gap-y-1">
            {cells.map((day, i) => {
              if (!day) return <div key={i} />;

              const past     = isPast(day);
              const blocked  = isBlocked(day);
              const overlap  = wouldOverlap(day);
              const sel      = isSelected(day);
              const tod      = isToday(day);
              const disabled = past || blocked || overlap;

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(day)}
                  disabled={disabled}
                  className="flex items-center justify-center rounded-full text-xs transition-all mx-auto relative"
                  style={{
                    width: '2rem',
                    height: '2rem',
                    fontFamily: 'var(--font-ui)',
                    fontWeight: sel ? 600 : 400,
                    backgroundColor: sel
                      ? 'var(--copper)'
                      : tod && !blocked && !overlap ? 'rgba(200,129,58,0.12)'
                      : blocked || overlap ? 'rgba(44,36,32,0.04)'
                      : 'transparent',
                    color: sel
                      ? '#fff'
                      : past ? 'rgba(44,36,32,0.15)'
                      : blocked || overlap ? 'rgba(44,36,32,0.25)'
                      : tod ? 'var(--copper)'
                      : 'var(--charcoal)',
                    cursor: disabled ? 'default' : 'pointer',
                    border: tod && !sel && !blocked && !overlap ? '1px solid var(--copper)' : '1px solid transparent',
                    textDecoration: blocked || overlap ? 'line-through' : 'none',
                  }}
                  onMouseEnter={e => { if (!disabled && !sel) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--stone)'; }}
                  onMouseLeave={e => { if (!disabled && !sel) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                  title={blocked || overlap ? 'Fecha no disponible' : undefined}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer: Limpiar y Hoy */}
          <div className="flex justify-between items-center mt-4 pt-3" style={{ borderTop: '1px solid var(--stone)' }}>
            <button onClick={() => onChange('')}
              className="text-xs transition-colors"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--copper)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}>
              Limpiar
            </button>
            <button
              onClick={() => { setViewMonth(today.getMonth()); setViewYear(today.getFullYear()); }}
              className="text-xs font-semibold transition-colors"
              style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>
              Hoy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}