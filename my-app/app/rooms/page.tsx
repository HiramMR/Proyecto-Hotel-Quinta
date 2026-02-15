// Import the shared Prisma client instance to interact with the database
import { prisma } from '@/lib/prisma';
// Import the Next.js Image component for optimized image rendering
import Image from 'next/image';
// Import the Next.js Link component for client-side navigation
import Link from 'next/link';

// Define the main page component as an async function (Server Component)
export default async function RoomsPage() {
  // Fetch all rooms from the database using Prisma
  const rooms = await prisma.room.findMany();

  // Render the page content
  return (
    // Main container with full height, padding, and background color
    <main className="min-h-screen p-8 bg-gray-50">
      {/* Page title */}
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Our Rooms
      </h1>
      
      {/* Conditional rendering: Check if there are no rooms */}
      {rooms.length === 0 ? (
        // Display a message if the database returned no rooms
        <div className="text-center text-gray-500 mt-10">
          <p className="text-xl">No rooms found.</p>
        </div>
      ) : (
        // If rooms exist, display them in a responsive grid layout
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Map over the array of rooms to create a card for each one */}
          {rooms.map((room) => (
            // Card container for a single room
            <div key={room.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Image container with relative positioning for the fill layout */}
              <div className="relative h-48 w-full bg-gray-200">
                {/* Optimized image component filling the container */}
                <Image 
                  src={room.imageUrl} // Path to the image
                  alt={room.name}     // Alt text for accessibility
                  fill                // Fills the parent container
                  className="object-cover" // Ensures the image covers the area without distortion
                />
              </div>
              
              {/* Content container for room details */}
              <div className="p-6">
                {/* Header section with room name and capacity badge */}
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-900">{room.name}</h2>
                  {/* Badge displaying guest capacity */}
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {room.capacity} Guests
                  </span>
                </div>
                
                {/* Room description limited to 3 lines */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {room.description}
                </p>
                
                {/* Footer section with price and booking button */}
                <div className="flex items-center justify-between mt-auto">
                  {/* Price display (converted from cents to dollars) */}
                  <span className="text-2xl font-bold text-gray-900">
                    ${(room.price / 100).toFixed(2)}
                  </span>
                  {/* Link to the individual room details page */}
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