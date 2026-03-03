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
          ? "rounded-2xl px-4 py-2 md:px-6 md:py-3"
          : "rounded-none px-6 py-4 md:px-12 border-x-0 border-t-0"
      }`}>
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Image src="/img/favicon.png" alt="Logo" width={40} height={40} className="w-8 h-8 md:w-10 md:h-10 object-contain" />
          <h1 className={`font-bold text-gray-800 hidden md:block tracking-tight transition-all duration-3 00 ${
            isScrolled ? "text-lg md:text-xl" : "text-xl md:text-2xl"
          }`}>
            Hotel Quinta Dalam
          </h1>
        </div>

        {/* Navigation Capsule */}
        <nav ref={navRef} className="relative flex items-center gap-1 bg-gray-100/80 p-1 rounded-full border border-white/50 shadow-inner">
            {/* The Moving Capsule */}
            <div 
                className="absolute top-1 bottom-1 bg-rose-600 rounded-full shadow-sm transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
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
                        className={`relative z-10 px-3 py-1.5 md:px-4 md:py-2 text-sm font-medium transition-colors duration-300 rounded-full ${isActive ? 'text-white' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        {link.name}
                    </Link>
                );
            })}
        </nav>

        {/* Login Button */}
        <Link href="/login" className="hidden md:block px-6 py-2.5 bg-rose-600 text-white text-sm font-bold rounded-full hover:bg-rose-700 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
            Iniciar Sesión
        </Link>
      </div>
    </header>
  );
}
