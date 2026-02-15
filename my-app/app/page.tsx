import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      {/* Carousel Section */}
      <div className="carrusel w-full max-w-6xl mx-auto overflow-hidden rounded-xl shadow-2xl">
        <ul className="flex overflow-x-auto snap-x snap-mandatory">
          <li className="min-w-full snap-center">
            <Image 
              src="/img/carrusel/1.jpg" 
              alt="Hotel View 1" 
              width={1200} 
              height={600} 
              className="w-full h-[600px] object-cover"
            />
          </li>
          <li className="min-w-full snap-center">
            <Image 
              src="/img/carrusel/2.jpg" 
              alt="Hotel View 2" 
              width={1200} 
              height={600} 
              className="w-full h-[600px] object-cover"
            />
          </li>
          {/* Add more images as needed */}
        </ul>
      </div>
    </main>
  );
}