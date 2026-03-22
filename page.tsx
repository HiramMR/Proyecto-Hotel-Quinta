import { prisma } from '@/lib/prisma';

export default async function RoomsPage() {
  const rooms = await prisma.room.findMany();

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Our Rooms
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 w-full bg-gray-200">
              {/* Ensure you have images in public/img/carrusel/ or replace with a placeholder */}
              <img 
                src={room.imageUrl} 
                alt={room.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">{room.name}</h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {room.capacity} Guests
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {room.description}
              </p>
              
              <div className="flex items-center justify-between mt-auto">
                <span className="text-2xl font-bold text-gray-900">
                  ${(room.price / 100).toFixed(2)}
                </span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}