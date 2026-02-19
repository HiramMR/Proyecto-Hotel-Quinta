// Importa la instancia compartida del cliente Prisma para interactuar con la base de datos
// import { prisma } from '@/lib/prisma'; // COMENTADO: Desactivado para desarrollo visual
// Importa el componente Image de Next.js para renderizado optimizado de imágenes
import Image from 'next/image';
// Importa el componente Link de Next.js para navegación del lado del cliente
import Link from 'next/link';

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
    <main className="min-h-screen p-8 bg-gray-50">
      {/* Título de la página */}
      <h1 className="room-page-title">
        Our Rooms
      </h1>
      
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
            <div key={room.id} className="room-card">
              {/* Contenedor de imagen con posicionamiento relativo para el diseño de relleno */}
              <div className="relative h-48 w-full bg-gray-200">
                {/* Componente de imagen optimizado que llena el contenedor */}
                <Image 
                  src={room.imageUrl || '/placeholder.jpg'} // Ruta a la imagen con respaldo
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
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}