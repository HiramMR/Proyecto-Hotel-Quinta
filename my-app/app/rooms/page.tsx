// Importa la instancia compartida del cliente Prisma para interactuar con la base de datos
// import { prisma } from '@/lib/prisma'; // COMENTADO: Desactivado para desarrollo visual
// Importa el componente Image de Next.js para renderizado optimizado de imágenes
import Image from 'next/image';
// Importa el componente Link de Next.js para navegación del lado del cliente
import Link from 'next/link';
import Carousel from '../components/Carousel';

// Datos de prueba (Mock Data) para trabajar sin base de datos
const mockRooms = [
  {
    id: '1',
    name: 'Suite de Lujo',
    capacity: 2,
    description: 'Una hermosa suite con vista al mar, perfecta para una escapada romántica. Incluye jacuzzi y servicio a la habitación.',
    price: 25000, // Representa $250.00 (en centavos)
    imageUrl: null,
  },
  {
    id: '2',
    name: 'Habitación Familiar',
    capacity: 4,
    description: 'Espaciosa habitación ideal para familias. Cuenta con dos camas queen y área de estar confortable.',
    price: 18000, // Representa $180.00
    imageUrl: null,
  },
  {
    id: '3',
    name: 'Habitación Estándar',
    capacity: 2,
    description: 'Comodidad y economía. Todo lo necesario para una estancia placentera y tranquila.',
    price: 10000, // Representa $100.00
    imageUrl: null,
  }
];

// Define el componente principal de la página como una función asíncrona (Server Component)
export default async function RoomsPage() {
  // USA DATOS FALSOS EN LUGAR DE LA BASE DE DATOS
  // const rooms = await prisma.room.findMany(); 
  const rooms = mockRooms;

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
      
      <Carousel/>

      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">Buscar una habitación</h2>
      
      {/* Contenedor principal de la barra de búsqueda. 
          - flex-col lg:flex-row: Columna en móviles, fila en pantallas grandes.
          - justify-center items-center: Centra el contenido horizontal y verticalmente.
          - gap-4: Espacio entre los elementos hijos. */}
      <div className="flex flex-col lg:flex-row justify-center items-center mb-12 px-8 gap-4">
        
        {/* Campo de búsqueda por texto (ej. ubicación o nombre) */}
        <div className="w-full lg:w-1/3">
          <input type="text" placeholder="Ej. Pátzcuaro" className="w-full px-5 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 text-black"
          />
        </div>
        
        {/* Contenedor para las fechas de llegada y salida */}
        <div className="flex w-full lg:w-auto gap-2">
          {/* Input de Fecha de Llegada */}
          <div className="relative w-full">
            {/* Etiqueta flotante sobre el borde del input */}
            <span className="absolute -top-2 left-2 bg-gray-50 px-1 text-xs text-gray-500">Llegada</span>
            <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 text-gray-700 bg-white" />
          </div>
          
          {/* Input de Fecha de Salida */}
          <div className="relative w-full">
            <span className="absolute -top-2 left-2 bg-gray-50 px-1 text-xs text-gray-500">Salida</span>
            <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 text-gray-700 bg-white" />
          </div>
        </div>

        {/* Botón y Menú desplegable de "Más filtros" */}
        {/* group: Permite controlar estilos de hijos basados en el estado del padre (hover) */}
        <div className="relative group w-full lg:w-auto">
            {/* Botón que activa el menú al pasar el mouse (hover) */}
            <button className="w-full lg:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 text-gray-700 bg-white flex items-center justify-center gap-2 hover:bg-gray-100">
              <span>Más filtros</span>
              {/* Icono de ajustes/filtros */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
              </svg>
            </button>
            
            {/* Menú desplegable (Dropdown) */}
            {/* hidden group-hover:block: Se muestra solo cuando el mouse está sobre el contenedor padre */}
            {/* z-20: Asegura que el menú aparezca por encima de otros elementos */}
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-xl hidden group-hover:block z-20 p-4">
              {/* Filtro de Capacidad */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 bg-white">
                  <option value="">Cualquiera</option>
                  <option value="2">2 Personas</option>
                  <option value="4">4 Personas</option>
                </select>
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
      
      <div className="p-8">
      {/* Renderizado condicional: Verifica si no hay habitaciones */}
      {rooms.length === 0 ? (
        // Muestra un mensaje si la base de datos no devolvió habitaciones
        <div className="text-center text-gray-500 mt-10">
          <p className="text-xl">No rooms found.</p>
        </div>
      ) : (
        // Si existen habitaciones, las muestra en un diseño de cuadrícula responsivo
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Itera sobre el array de habitaciones para crear una tarjeta para cada una */}
          {rooms.map((room) => (
            // Contenedor de tarjeta para una habitación individual
            <div key={room.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Contenedor de imagen con posicionamiento relativo para el diseño de relleno */}
              <div className="relative h-48 w-full bg-gray-200">
                {/* Componente de imagen optimizado que llena el contenedor */}
                <Image 
                  src={room.imageUrl || '/img/banner.png'} // Ruta a la imagen con respaldo
                  alt={room.name || 'Room image'}     // Texto alternativo para accesibilidad
                  fill                // Llena el contenedor padre
                  className="object-cover" // Asegura que la imagen cubra el área sin distorsión
                />
              </div>
              
              {/* Contenedor de contenido para los detalles de la habitación */}
              <div className="p-6">
                {/* Sección de encabezado con nombre de la habitación e insignia de capacidad */}
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-900">{room.name}</h2>
                  {/* Insignia que muestra la capacidad de huéspedes */}
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {room.capacity} Guests
                  </span>
                </div>
                
                {/* Descripción de la habitación limitada a 3 líneas */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {room.description}
                </p>
                
                {/* Sección de pie de página con precio y botón de reserva */}
                <div className="flex items-center justify-between mt-auto">
                  {/* Visualización del precio (convertido de centavos a dólares) */}
                  <span className="text-2xl font-bold text-gray-900">
                    ${(Number(room.price) / 100).toFixed(2)}
                  </span>
                  {/* Enlace a la página de detalles individuales de la habitación */}
                  <Link 
                    href={`/rooms/${room.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Reservar ahora
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </main>
  );
}