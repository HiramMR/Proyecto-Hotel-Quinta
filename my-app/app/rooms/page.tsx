'use client';

// Importa la instancia compartida del cliente Prisma para interactuar con la base de datos
// import { prisma } from '@/lib/prisma'; // COMENTADO: Desactivado para desarrollo visual
// Importa el componente Image de Next.js para renderizado optimizado de imágenes
import Image from 'next/image';
// Importa el componente Link de Next.js para navegación del lado del cliente
import Link from 'next/link';
import cn from 'classnames';
import { useState } from 'react';
import Carousel from '../components/Carousel';
import RoomCard from '../components/RoomCard';

// Datos de prueba (Mock Data) para trabajar sin base de datos
const RoomImages = [
  "/img/room1.jpg",
  "/img/room2.jpg",
  "/img/room3.jpg",
  "/img/room4.jpg"
];

const amenitiesList = [
  { name: "1 Cama", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2 20h20M4 20V10a2 2 0 012-2h12a2 2 0 012 2v10M4 14h16" /></svg> },
  { name: "2 Camas", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2 20h20M3 20V10a1 1 0 011-1h6a1 1 0 011 1v10M13 20V10a1 1 0 011-1h6a1 1 0 011 1v10" /></svg> },
  { name: "Agua caliente", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /></svg> },
  { name: "Toallas", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7m14 0V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2m14 0H5" /></svg> },
  { name: "Secadora", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg> },
  { name: "Wifi", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" /></svg> },
  { name: "Room-service", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg> },
  { name: "Pet-friendly", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" /></svg> },
  { name: "Television", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z" /></svg> },
  { name: "Minibar", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3h14v18H5V3zm2 2v14h10V5H7zm2 2h2v2H9V7z" /></svg> },
];

const availableRooms = [
  {
    id: 1,
    title: "Suite de Lujo",
    description: "Espacio amplio con jacuzzi privado y vista panorámica al océano.",
    price: 250,
    images: ["/img/room1.jpg", "/img/room2.jpg", "/img/room3.jpg", "/img/room4.jpg"],
    capacity: 2,
    popular: true,
    amenities: ["1 Cama", "Agua caliente", "Wifi", "Minibar"]
  },
  {
    id: 2,
    title: "Habitación Familiar",
    description: "Espaciosa habitación ideal para familias. Cuenta con dos camas queen y área de estar confortable.",
    price: 180,
    images: ["/img/room2.jpg", "/img/room1.jpg", "/img/room3.jpg", "/img/room4.jpg"],
    capacity: 4,
    popular: true,
    amenities: ["2 Camas", "Television", "Room-service"]
  },
  {
    id: 3,
    title: "Habitación Estándar",
    description: "Comodidad y economía. Todo lo necesario para una estancia placentera y tranquila.",
    price: 100,
    images: ["/img/room3.jpg", "/img/room2.jpg", "/img/room1.jpg", "/img/room4.jpg"],
    capacity: 2,
    popular: false,
    amenities: ["1 Cama", "Wifi"]
  },
  {
    id: 4,
    title: "Habitación Sencilla",
    description: "Comodidad y economía. Todo lo necesario para una estancia placentera y tranquila.",
    price: 100,
    images: ["/img/room4.jpg", "/img/room3.jpg", "/img/room2.jpg", "/img/room1.jpg"],
    capacity: 1,
    popular: false,
    amenities: ["1 Cama", "Toallas"]
  }
];


// Define el componente principal de la página como una función asíncrona (Server Component)
export default function RoomsPage() {
  // USA DATOS FALSOS EN LUGAR DE LA BASE DE DATOS
  // const rooms = await prisma.room.findMany(); 
  const rooms = availableRooms;
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCapacity, setSelectedCapacity] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const roomSlides = availableRooms.map(room => ({
    src: room.images[0],
    content: (
      <div className="text-center">
        <h3 className="text-4xl font-bold mb-2 drop-shadow-lg">{room.title}</h3>
        {room.popular && (
          <div className="flex justify-center gap-2 mb-4">
            <span className="bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
              Popular
            </span>
          </div>
        )}
        <div className="flex justify-center gap-4 mt-4">
          {room.amenities?.map(amenityName => {
            const amenity = amenitiesList.find(a => a.name === amenityName);
            return amenity ? (
              <div key={amenityName} className="bg-white/20 p-2 rounded-full backdrop-blur-sm" title={amenityName}>
                {amenity.icon}
              </div>
            ) : null;
          })}
        </div>
      </div>
    )
  }));

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  // Renderiza el contenido de la página
  return (
    // Contenedor principal con altura completa, relleno y color de fondo
    <main className="min-h-screen bg-gray-50">
      <div className="p-8">
        {/* Título de la página */}
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          Nuestras Habitaciones más Populares
        </h1>
      </div>
      
      <Carousel slides={roomSlides} className="h-[500px] mb-12 shadow-2xl rounded-b-3xl" />

      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">Buscar una habitación</h2>
      
      {/* Contenedor principal de la barra de búsqueda. 
          - flex-col lg:flex-row: Columna en móviles, fila en pantallas grandes.
          - justify-center items-center: Centra el contenido horizontal y verticalmente.
          - gap-4: Espacio entre los elementos hijos. */}
      <div className="flex flex-col lg:flex-row justify-center items-center mb-12 px-8 gap-4">
        
        {/* Campo de búsqueda por texto (ej. ubicación o nombre) */}
        <div className="w-full lg:w-1/3">
          <input type="text" placeholder="Ej. Pátzcuaro" className="w-full px-5 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-700 text-black"
          />
        </div>
        
        {/* Contenedor para las fechas de llegada y salida */}
        <div className="flex w-full lg:w-auto gap-2">
          {/* Input de Fecha de Llegada */}
          <div className="relative w-full">
            {/* Etiqueta flotante sobre el borde del input */}
            <span className="absolute -top-2 left-2 bg-gray-50 px-1 text-xs text-gray-500">Llegada</span>
            <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-700 text-gray-700 bg-white" />
          </div>
          
          {/* Input de Fecha de Salida */}
          <div className="relative w-full">
            <span className="absolute -top-2 left-2 bg-gray-50 px-1 text-xs text-gray-500">Salida</span>
            <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-700 text-gray-700 bg-white" />
          </div>
        </div>

        {/* Botón y Menú desplegable de "Más filtros" */}
        <div className="relative w-full lg:w-auto">
            {/* Botón que activa el menú al hacer click */}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="w-full lg:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-700 text-gray-700 bg-white flex items-center justify-center gap-2 hover:bg-gray-100"
            >
              <span>Más filtros</span>
              {/* Icono de ajustes/filtros */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
              </svg>
            </button>
            
            {/* Menú desplegable (Dropdown) */}
              <div className={cn("transition-all duration-300 ease-in-out absolute top-full left-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-xl z-20 p-4 origin-top transform",
                showFilters ? "opacity-100 scale-y-100 translate-y-0 visible" : "opacity-0 scale-y-95 -translate-y-2 invisible pointer-events-none"
              )}>
              {/* Filtro de Capacidad */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Capacidad</label>
                <div className="flex items-center justify-baseline gap-20">
                  {[2, 4, 6, 8].map((capacity) => (
                    <button
                      key={capacity}
                      onClick={() => setSelectedCapacity(selectedCapacity === capacity ? null : capacity)}
                      className={cn("flex items-center gap-1 transition-colors duration-200",
                        selectedCapacity === capacity ? "text-pink-700 font-bold" : "text-gray-500 hover:text-gray-700"
                      )}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">{capacity}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Rango de Precio */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rango de precio</label>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 font-medium">$0</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="10000" 
                    value={maxPrice} 
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-700"
                  />
                  <span className="text-sm text-gray-600 font-medium">$10000</span>
                </div>
                <div className="text-center text-sm font-medium text-pink-700 mt-2">
                  Hasta ${maxPrice}
                </div>
              </div>

              {/* Amenidades */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Amenidades</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {amenitiesList.map((amenity) => (
                    <button
                      key={amenity.name}
                      onClick={() => toggleAmenity(amenity.name)}
                      className={cn("flex flex-col items-center justify-center gap-2 p-2 rounded-lg transition-colors duration-200",
                        selectedAmenities.includes(amenity.name) ? "text-pink-700 font-bold bg-pink-50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      {amenity.icon}
                      <span className="text-xs text-center">{amenity.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Opciones de ordenamiento */}
              <div className="border-t border-gray-100 pt-2">
                <a href="#" className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Precio: Menor a Mayor</a>
                <a href="#" className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Precio: Mayor a Menor</a>
                <a href="#" className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Más populares</a>
              </div>
            </div>
        </div>
      </div>
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">Todas nuestras habitaciones</h2>
      
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
                {availableRooms.map((room) => (
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
    </main>
  );
}