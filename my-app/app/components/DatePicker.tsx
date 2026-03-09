'use client';

import { useState } from 'react';

interface DatePickerProps {
  label: string;
  value: string;
  onChange: (date: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DAYS = ['Do','Lu','Ma','Mi','Ju','Vi','Sá'];

export default function DatePicker({ label, value, onChange, isOpen, onToggle }: DatePickerProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
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

  // Días del mes en cuadrícula
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Rellenar hasta múltiplo de 7
  while (cells.length % 7 !== 0) cells.push(null);

  const isToday = (d: number) =>
    d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  const isSelected = (d: number) =>
    selected && d === selected.getDate() && viewMonth === selected.getMonth() && viewYear === selected.getFullYear();

  const isPast = (d: number) => {
    const date = new Date(viewYear, viewMonth, d);
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return date < todayMidnight;
  };

  const handleSelect = (d: number) => {
    if (isPast(d)) return;
    const month = String(viewMonth + 1).padStart(2, '0');
    const day = String(d).padStart(2, '0');
    onChange(`${viewYear}-${month}-${day}`);
  };

  const formatDisplay = () => {
    if (!selected) return label;
    return selected.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="relative w-full">
      {/* Botón trigger */}
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

      {/* Calendario dropdown */}
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
          {/* Encabezado mes/año */}
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

          {/* Días de la semana */}
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
              const past = isPast(day);
              const sel = isSelected(day);
              const tod = isToday(day);
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(day)}
                  disabled={past}
                  className="flex items-center justify-center rounded-full text-xs transition-all mx-auto"
                  style={{
                    width: '2rem',
                    height: '2rem',
                    fontFamily: 'var(--font-ui)',
                    fontWeight: sel ? 600 : 400,
                    backgroundColor: sel ? 'var(--copper)' : tod ? 'rgba(200,129,58,0.12)' : 'transparent',
                    color: sel ? '#fff' : past ? 'rgba(44,36,32,0.2)' : tod ? 'var(--copper)' : 'var(--charcoal)',
                    cursor: past ? 'default' : 'pointer',
                    border: tod && !sel ? '1px solid var(--copper)' : '1px solid transparent',
                  }}
                  onMouseEnter={e => { if (!past && !sel) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--stone)'; }}
                  onMouseLeave={e => { if (!past && !sel) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center mt-4 pt-3" style={{ borderTop: '1px solid var(--stone)' }}>
            <button
              onClick={() => { onChange(''); }}
              className="text-xs transition-colors"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--copper)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}
            >
              Limpiar
            </button>
            <button
              onClick={() => {
                const t = today;
                setViewMonth(t.getMonth());
                setViewYear(t.getFullYear());
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