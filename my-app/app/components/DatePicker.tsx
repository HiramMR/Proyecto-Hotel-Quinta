// ============================================================
// DatePicker.tsx — Calendario personalizado (Client Component)
//
// Reemplaza el input type="date" nativo del navegador, que tiene
// un diseño fijo que no se puede personalizar fácilmente.
// Este componente construye el calendario completamente desde cero
// para que coincida con el sistema de diseño del hotel.
//
// Props:
// - label: texto placeholder cuando no hay fecha seleccionada
// - value: fecha seleccionada en formato "YYYY-MM-DD" (o "" si vacío)
// - onChange: función que recibe la nueva fecha seleccionada
// - isOpen: si el calendario está desplegado (controlado desde el padre)
// - onToggle: función para abrir/cerrar el calendario
//
// El estado abierto/cerrado se maneja en el componente padre (rooms/page.tsx)
// para que solo un DatePicker esté abierto a la vez.
// ============================================================
'use client';

import { useState } from 'react';

interface DatePickerProps {
  label: string;
  value: string;        // Formato: "YYYY-MM-DD" o ""
  onChange: (date: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

// Nombres de los meses en español (índice 0 = Enero)
const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

// Nombres cortos de los días de la semana (empezando en Domingo)
const DAYS = ['Do','Lu','Ma','Mi','Ju','Vi','Sá'];

export default function DatePicker({ label, value, onChange, isOpen, onToggle }: DatePickerProps) {
  const today = new Date();

  // viewYear y viewMonth: el mes/año que se está mostrando en el calendario
  // (puede ser diferente al mes de la fecha seleccionada si el usuario navega)
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  // Convertir el valor string "YYYY-MM-DD" a objeto Date
  // Se agrega 'T00:00:00' para evitar problemas de zona horaria
  const selected = value ? new Date(value + 'T00:00:00') : null;

  // ── Navegación entre meses ──
  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } // Enero → Diciembre del año anterior
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } // Diciembre → Enero del año siguiente
    else setViewMonth(m => m + 1);
  };

  // ── Construir la cuadrícula de días ──
  // firstDay: día de la semana en que empieza el mes (0=Dom, 1=Lun, etc.)
  // Sirve para agregar celdas vacías al inicio del calendario
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate(); // Día 0 del mes siguiente = último del actual

  // cells: array con null (celdas vacías) y números (días del mes)
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),                          // Celdas vacías antes del día 1
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1), // Días del 1 al último
  ];
  // Rellenar hasta completar la última fila (múltiplo de 7)
  while (cells.length % 7 !== 0) cells.push(null);

  // ── Funciones auxiliares de estado de cada día ──
  const isToday = (d: number) =>
    d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  const isSelected = (d: number) =>
    selected !== null &&
    d === selected.getDate() &&
    viewMonth === selected.getMonth() &&
    viewYear === selected.getFullYear();

  // Los días pasados no se pueden seleccionar (no tiene sentido reservar en el pasado)
  const isPast = (d: number) => {
    const date = new Date(viewYear, viewMonth, d);
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return date < todayMidnight;
  };

  // ── Manejar la selección de un día ──
  const handleSelect = (d: number) => {
    if (isPast(d)) return; // Ignorar días pasados
    // Formatear como "YYYY-MM-DD" con padding de ceros
    const month = String(viewMonth + 1).padStart(2, '0');
    const day = String(d).padStart(2, '0');
    onChange(`${viewYear}-${month}-${day}`);
  };

  // ── Texto del botón trigger ──
  // Si hay fecha seleccionada, la muestra en formato local español.
  // Si no, muestra el label (placeholder).
  const formatDisplay = () => {
    if (!selected) return label;
    return selected.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="relative w-full">

      {/* ── BOTÓN TRIGGER ──
          Abre/cierra el calendario al hacer clic.
          Su borde cambia a cobre cuando el calendario está abierto. */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 transition-colors"
        style={{
          padding: '0.75rem 1.25rem',
          border: `1px solid ${isOpen ? 'var(--copper)' : 'var(--stone)'}`, // Cobre si abierto
          borderRadius: '8px',
          backgroundColor: isOpen ? 'rgba(200,129,58,0.05)' : 'var(--cream)',
          color: value ? 'var(--charcoal)' : 'var(--text-muted)', // Más oscuro si tiene valor
          fontFamily: 'var(--font-ui)',
          fontSize: '0.85rem',
          textAlign: 'left',
        }}
      >
        {/* Ícono de calendario */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
          className="w-4 h-4 shrink-0" style={{ color: 'var(--copper)' }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
        <span>{formatDisplay()}</span>
      </button>

      {/* ── CALENDARIO DESPLEGABLE ──
          Solo se renderiza cuando isOpen=true.
          zIndex: 9999 para aparecer encima de todos los demás elementos. */}
      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 select-none"
          style={{
            backgroundColor: 'var(--cream)',
            border: '1px solid var(--stone)',
            borderRadius: '4px 16px 4px 16px',
            boxShadow: '0 20px 60px rgba(44,36,32,0.18)',
            zIndex: 9999,
            width: '17rem',
            padding: '1rem',
          }}
        >
          {/* Encabezado: nombre del mes, año y flechas de navegación */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-1 rounded-full hover:bg-[var(--stone)] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4" style={{ color: 'var(--charcoal)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <span className="text-sm font-semibold uppercase tracking-widest" style={{ fontFamily: 'var(--font-ui)', color: 'var(--charcoal)' }}>
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button onClick={nextMonth} className="p-1 rounded-full hover:bg-[var(--stone)] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4" style={{ color: 'var(--charcoal)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>

          {/* Cabecera de días de la semana (Do, Lu, Ma, ...) */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map(d => (
              <div key={d} className="text-center text-xs font-semibold py-1"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Cuadrícula de días del mes */}
          <div className="grid grid-cols-7 gap-y-1">
            {cells.map((day, i) => {
              // Celda vacía (antes del día 1 o relleno al final)
              if (!day) return <div key={i} />;

              const past = isPast(day);
              const sel = isSelected(day);
              const tod = isToday(day);

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(day)}
                  disabled={past} // Días pasados no clicables
                  className="flex items-center justify-center rounded-full text-xs transition-all mx-auto"
                  style={{
                    width: '2rem',
                    height: '2rem',
                    fontFamily: 'var(--font-ui)',
                    fontWeight: sel ? 600 : 400,
                    // Fondo: cobre (seleccionado), crema suave (hoy), transparente (resto)
                    backgroundColor: sel ? 'var(--copper)' : tod ? 'rgba(200,129,58,0.12)' : 'transparent',
                    // Color: blanco (seleccionado), gris (pasado), cobre (hoy), oscuro (normal)
                    color: sel ? '#fff' : past ? 'rgba(44,36,32,0.2)' : tod ? 'var(--copper)' : 'var(--charcoal)',
                    cursor: past ? 'default' : 'pointer',
                    // Borde cobre para el día de hoy (cuando no está seleccionado)
                    border: tod && !sel ? '1px solid var(--copper)' : '1px solid transparent',
                  }}
                  // Hover manual con JS porque los estilos inline no soportan :hover
                  onMouseEnter={e => { if (!past && !sel) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--stone)'; }}
                  onMouseLeave={e => { if (!past && !sel) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer del calendario: Limpiar y Hoy */}
          <div className="flex justify-between items-center mt-4 pt-3" style={{ borderTop: '1px solid var(--stone)' }}>
            {/* Limpiar: borra la fecha seleccionada */}
            <button
              onClick={() => { onChange(''); }}
              className="text-xs transition-colors"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--copper)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}
            >
              Limpiar
            </button>
            {/* Hoy: navega la vista al mes actual (sin seleccionar) */}
            <button
              onClick={() => {
                setViewMonth(today.getMonth());
                setViewYear(today.getFullYear());
              }}
              className="text-xs font-semibold transition-colors"
              style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}
            >
              Hoy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}