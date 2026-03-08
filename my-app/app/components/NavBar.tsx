// app/components/NavBar.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import cn from 'classnames';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const [capsuleStyle, setCapsuleStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    { name: 'Inicio', href: '/' },
    { name: 'Habitaciones', href: '/rooms' },
    { name: 'Contacto', href: '/contact' },
    { name: 'Nosotros', href: '/about' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const updateCapsule = () => {
      if (!navRef.current) return;
      
      // Encuentra el enlace activo basado en la ruta actual
      const activeLink = Array.from(navRef.current.querySelectorAll('a')).find(link => {
          const href = link.getAttribute('href');
          if (href === '/') return pathname === '/';
          return pathname.startsWith(href || '');
      });

      if (activeLink) {
        const { offsetLeft, offsetWidth } = activeLink as HTMLElement;
        setCapsuleStyle({ left: offsetLeft, width: offsetWidth, opacity: 1 });
      } else {
        setCapsuleStyle(prev => ({ ...prev, opacity: 0 }));
      }
    };

    updateCapsule();
    window.addEventListener('resize', updateCapsule);
    return () => window.removeEventListener('resize', updateCapsule);
  }, [pathname]);

  // Cierra el menú móvil al cambiar de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header 
      className={cn('fixed z-50 transition-all duration-1500 ease-in-out', 
        isMounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4",
        isScrolled 
          ? "top-4 left-0 right-0 mx-auto max-w-7xl px-4 md:px-8"
          : "top-0 left-0 right-0 w-full"
      )}
    >
      <div className={`flex items-center justify-between bg-white/70 backdrop-blur-xl shadow-sm border border-white/40 transition-all duration-300 ease-in-out ${
        isScrolled
          ? "rounded-2xl px-3 py-2 md:px-6 md:py-2"
          : "rounded-none px-4 py-3 md:px-8 border-x-0 border-t-0"
      }`}>
        
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0 pr-2">
          <Image src="/img/Logo.png" alt="Logo Quinta Dalam" width={40} height={40} className="w-8 h-8 md:w-9 md:h-9 object-contain" />
          <h1 className={`font-bold text-gray-800 tracking-tight transition-all duration-300 ${
            isScrolled ? "text-base md:text-lg" : "text-lg md:text-xl"
          }`}>
            Hotel Quinta Dalam
          </h1>
        </div>

        {/* Navigation Capsule */}
        <nav ref={navRef} className="hidden md:flex relative items-center gap-1 bg-gray-100/80 p-1 rounded-full border border-white/50 shadow-inner">
            {/* The Moving Capsule */}
            <div 
                className="absolute top-1 bottom-1 bg-pink-700 rounded-full shadow-sm transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
                style={{ 
                    left: capsuleStyle.left, 
                    width: capsuleStyle.width, 
                    opacity: capsuleStyle.opacity 
                }}
            />

            {links.map((link) => {
                const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
                return (
                    <Link 
                        key={link.href} 
                        href={link.href}
                        className={`relative z-10 px-3 py-1.5 text-xs md:text-sm font-medium transition-colors duration-300 rounded-full ${isActive ? 'text-white' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        {link.name}
                    </Link>
                );
            })}
        </nav>

        {/* Login Button */}
        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden md:block shrink-0 px-4 py-2 bg-pink-700 text-white text-xs md:text-sm font-bold rounded-full hover:bg-pink-800 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              Iniciar Sesión
          </Link>

          {/* Hamburger Button */}
          <button 
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
              {isMobileMenuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
              ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
              )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn("md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-lg transition-all duration-300 ease-in-out overflow-hidden",
          isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
      )}>
          <div className="flex flex-col p-4 gap-2">
            {links.map((link) => (
                <Link 
                    key={link.href} 
                    href={link.href}
                    className={cn("px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                        pathname === link.href ? "bg-pink-50 text-pink-700" : "text-gray-600 hover:bg-gray-50"
                    )}
                >
                    {link.name}
                </Link>
            ))}
            <hr className="my-2 border-gray-100"/>
            <Link href="/login" className="px-4 py-3 text-center bg-pink-700 text-white text-sm font-bold rounded-xl hover:bg-pink-800 transition shadow-md">
                Iniciar Sesión
            </Link>
          </div>
      </div>
    </header>
  );
}
