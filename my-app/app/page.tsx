'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import cn from 'classnames';
import Carousel from './components/Carousel';
import RoomCard from './components/RoomCard';

const bannerImages = [
  "/img/carrusel/outside.jpg",
  "/img/carrusel/lobby.jpg",
  "/img/carrusel/lobby2.jpg",
  "/img/carrusel/lago.jpg",
];

const featuredRooms = [
  {
    id: 1,
    title: "Suite de Lujo",
    description: "Espacio amplio con jacuzzi privado y vista panorámica al océano.",
    price: 250,
    images: ["/img/room1.jpg", "/img/room2.jpg", "/img/room3.jpg", "/img/room4.jpg"],
    capacity: 2
  },
  {
    id: 2,
    title: "Habitación Familiar",
    description: "Espaciosa habitación ideal para familias. Cuenta con dos camas queen y área de estar confortable.",
    price: 180,
    images: ["/img/room2.jpg", "/img/room1.jpg", "/img/room3.jpg", "/img/room4.jpg"],
    capacity: 4
  },
  {
    id: 3,
    title: "Habitación Estándar",
    description: "Comodidad y economía. Todo lo necesario para una estancia placentera y tranquila.",
    price: 100,
    images: ["/img/room3.jpg", "/img/room2.jpg", "/img/room1.jpg", "/img/room4.jpg"],
    capacity: 2
  },
  {
    id: 4,
    title: "Habitación Sencilla",
    description: "Comodidad y economía. Todo lo necesario para una estancia placentera y tranquila.",
    price: 100,
    images: ["/img/room4.jpg", "/img/room3.jpg", "/img/room2.jpg", "/img/room1.jpg"],
    capacity: 1
  }
];

// Define el componente principal de la página como una función asíncrona (Server Component)
export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 700);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 250);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  // Renderiza el contenido de la página
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen w-full">
        <div className="absolute inset-0">
            <Carousel images={bannerImages} className="h-full" />
            <div className="absolute inset-0 bg-black/35 pointer-events-none" />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 px-4 text-center">

          <h1 className={cn("transition-all duration-2000 ease-in-out relative text-5xl md:text-5xl font-bold mb-6 drop-shadow-lg tracking-tight", 
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4", )}>
            Hotel Quinta Dalam
          </h1>
          <p className={cn("transition-all duration-2000 ease-in-out relative text-xl md:text-2xl mb-10 max-w-2xl drop-shadow-md font-light",
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4",
          )}>
            Experimenta el lujo y la comodidad en el corazón de la ciudad. Tu escape perfecto comienza aquí.
          </p>
          {/*<Link 
            href="/rooms" 
            className={cn("transition-all duration-2000 ease-in-out relative bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 px-10 rounded-full text-lg shadow-xl hover:scale-105 transform",
                isMounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4", pejebauzer
            )}>
            Reservar Ahora
          </Link>*/}
        </div>
      </section>

      {/* Buscador de Disponibilidad  */}
      <div className={cn('transition-all duration-3500 ease-in-out relative -mt-38 z-20 container mx-auto px-4 mb-40 ', 
                isMounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4",
                isScrolled 
                ? "translate-y-28"
                : "-translate-y-4"
              )}>
        <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col lg:flex-row gap-6 items-end justify-between border border-gray-100">
            <div className="flex-1 w-full">
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Llegada</label>
                <input type="date" className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-pink-700 focus:border-transparent outline-none transition" />
            </div>
            <div className="flex-1 w-full">
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Salida</label>
                <input type="date" className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-pink-700 focus:border-transparent outline-none transition" />
            </div>
            <div className="flex-1 w-full">
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Huéspedes</label>
                <select className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 bg-white focus:ring-2 focus:ring-pink-700 focus:border-transparent outline-none transition">
                    <option>1 Persona</option>
                    <option>2 Personas</option>
                    <option>3 Personas</option>
                    <option>4+ Personas</option>
                </select>
            </div>
            <div className="w-full lg:w-auto">
                 <Link href="/rooms" className="block w-full bg-pink-700 text-white py-3 px-8 rounded-lg hover:bg-pink-800 text-center transition font-semibold shadow-md">
                    Buscar Disponibilidad
                 </Link>
            </div>
        </div>
      </div>

      {/* Preview de habitaciones destacadas */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
                <div className="">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 ">Habitaciones Destacadas</h2>
                    <p className="text-gray-600 text-lg">Elige el espacio perfecto para tu descanso.</p>
                </div>
                <Link href="/rooms" className="text-pink-700 font-bold hover:text-pink-800 transition flex items-center gap-2 group">
                    Ver todas las habitaciones <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </Link>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8">
                {featuredRooms.map((room) => (
                  <RoomCard 
                    key={room.id}
                    title={room.title}
                    description={room.description}
                    price={room.price}
                    images={room.images}
                    capacity={room.capacity}
                  />
                ))}
            </div>
        </div>
      </section>

     {/* Features Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">¿Por qué elegirnos?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Nos dedicamos a ofrecerte una experiencia inigualable con servicios de primera clase.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center p-8 rounded-2xl hover:bg-pink-200 transition duration-300 group">
                <div className="text-5xl mb-6 group-hover:scale-110 transition duration-300">🌊</div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">Lorem</h3>
                <p className="text-gray-600 leading-relaxed">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut repudiandae nobis animi reiciendis voluptatem qui, similique vitae modi possimus, magnam quidem reprehenderit voluptates ullam doloremque consectetur aliquid vel natus dolorem!</p>
            </div>
            <div className="text-center p-8 rounded-2xl hover:bg-pink-200 transition duration-300 group">
                <div className="text-5xl mb-6 group-hover:scale-110 transition duration-300">🍽️</div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">Gastronomía Exquisita</h3>
                <p className="text-gray-600 leading-relaxed">Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur magnam error quidem labore consequuntur eum doloribus temporibus voluptatum aliquid in! Architecto autem iusto ut deleniti vel hic voluptatibus sit eaque?</p>
            </div>
            <div className="text-center p-8 rounded-2xl hover:bg-pink-200 transition duration-300 group">
                <div className="text-5xl mb-6 group-hover:scale-110 transition duration-300">💆‍♀️</div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">Spa & Relax</h3>
                <p className="text-gray-600 leading-relaxed">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laboriosam eveniet reprehenderit unde distinctio quisquam, aut, modi eligendi ut asperiores praesentium nam eum culpa quae tempore obcaecati assumenda nesciunt ipsa sequi.</p>
            </div>
        </div>
      </section>

      {/* footer */}
      <section className="py-24 bg-pink-900 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/img/banner.png')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">¿Listo para unas vacaciones inolvidables?</h2>
            <p className="text-xl text-pink-100 mb-10 max-w-2xl mx-auto">Reserva directamente con nosotros y obtén los mejores precios garantizados y beneficios exclusivos.</p>
            <Link href="/contact" className="bg-white text-pink-900 font-bold py-4 px-10 rounded-full hover:bg-pink-50 transition duration-300 shadow-xl inline-block">
                Contáctanos Hoy
            </Link>
        </div>
        </section>
    </main>
  );
}