import Image from 'next/image';
import Link from 'next/link';

// Define el componente principal de la página como una función asíncrona (Server Component)
export default function HomePage() {
  // Renderiza el contenido de la página
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full">
        <div className="absolute inset-0">
            <Image
                src="/img/banner.png"
                alt="Hotel Quinta Dalam View"
                fill
                className="object-cover brightness-[0.65]"
                priority
            />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 px-4 text-center">
          <h1 className="text-5xl md:text-5xl font-bold mb-6 drop-shadow-lg tracking-tight">
            Hotel Quinta Dalam
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-2xl drop-shadow-md font-light">
            Experimenta el lujo y la comodidad en el corazón de la ciudad. Tu escape perfecto comienza aquí.
          </p>
          <Link 
            href="/rooms" 
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 px-10 rounded-full transition duration-300 text-lg shadow-xl hover:scale-105 transform"
          >
            Reservar Ahora
          </Link>
        </div>
      </section>

      {/* Search/Availability Bar (Floating overlap) */}
      <div className="relative -mt-24 z-20 container mx-auto px-4 mb-20">
        <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col lg:flex-row gap-6 items-end justify-between border border-gray-100">
            <div className="flex-1 w-full">
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Llegada</label>
                <input type="date" className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition" />
            </div>
            <div className="flex-1 w-full">
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Salida</label>
                <input type="date" className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition" />
            </div>
            <div className="flex-1 w-full">
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Huéspedes</label>
                <select className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 bg-white focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition">
                    <option>1 Persona</option>
                    <option>2 Personas</option>
                    <option>3 Personas</option>
                    <option>4+ Personas</option>
                </select>
            </div>
            <div className="w-full lg:w-auto">
                 <Link href="/rooms" className="block w-full bg-rose-600 text-white py-3 px-8 rounded-lg hover:bg-rose-700 text-center transition font-semibold shadow-md">
                    Buscar Disponibilidad
                 </Link>
            </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">¿Por qué elegirnos?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Nos dedicamos a ofrecerte una experiencia inigualable con servicios de primera clase.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center p-8 rounded-2xl hover:bg-rose-50 transition duration-300 group">
                <div className="text-5xl mb-6 group-hover:scale-110 transition duration-300">🌊</div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">Lorem</h3>
                <p className="text-gray-600 leading-relaxed">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut repudiandae nobis animi reiciendis voluptatem qui, similique vitae modi possimus, magnam quidem reprehenderit voluptates ullam doloremque consectetur aliquid vel natus dolorem!</p>
            </div>
            <div className="text-center p-8 rounded-2xl hover:bg-rose-50 transition duration-300 group">
                <div className="text-5xl mb-6 group-hover:scale-110 transition duration-300">🍽️</div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">Gastronomía Exquisita</h3>
                <p className="text-gray-600 leading-relaxed">Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur magnam error quidem labore consequuntur eum doloribus temporibus voluptatum aliquid in! Architecto autem iusto ut deleniti vel hic voluptatibus sit eaque?</p>
            </div>
            <div className="text-center p-8 rounded-2xl hover:bg-rose-50 transition duration-300 group">
                <div className="text-5xl mb-6 group-hover:scale-110 transition duration-300">💆‍♀️</div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">Spa & Relax</h3>
                <p className="text-gray-600 leading-relaxed">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laboriosam eveniet reprehenderit unde distinctio quisquam, aut, modi eligendi ut asperiores praesentium nam eum culpa quae tempore obcaecati assumenda nesciunt ipsa sequi.</p>
            </div>
        </div>
      </section>

      {/* Preview de habitaciones destacadas */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
                <div className="">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 ">Habitaciones Destacadas</h2>
                    <p className="text-gray-600 text-lg">Elige el espacio perfecto para tu descanso.</p>
                </div>
                <Link href="/rooms" className="text-rose-600 font-bold hover:text-rose-800 transition flex items-center gap-2 group">
                    Ver todas las habitaciones <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </Link>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8">
                 {/* Cartas de las habitaciones */}
                 <div className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.33rem)] bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 group">
                    <div className="relative h-72 overflow-hidden">
                        <Image src="/img/banner.png" alt="Suite" fill className="object-cover group-hover:scale-105 transition duration-500" />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-rose-900 shadow-sm">Popular</div>
                    </div>
                    <div className="p-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Suite de Lujo</h3>
                        <p className="text-gray-600 mb-6 line-clamp-2">Espacio amplio con jacuzzi privado y vista panorámica al océano.</p>
                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                            <span className="text-2xl font-bold text-gray-900">$250 <span className="text-sm text-gray-500 font-normal">/ noche</span></span>
                            <Link href="/rooms" className="px-5 py-2.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition font-medium">
                                Reservar
                            </Link>
                        </div>
                    </div>
                 </div>
                  {/* Carta */}
                 <div className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.33rem)] bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 group">
                    <div className="relative h-72 overflow-hidden">
                        <Image src="/img/banner.png" alt="Suite" fill className="object-cover group-hover:scale-105 transition duration-500" />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-rose-900 shadow-sm">Popular</div>
                    </div>
                    <div className="p-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Suite de Lujo</h3>
                        <p className="text-gray-600 mb-6 line-clamp-2">Espacio amplio con jacuzzi privado y vista panorámica al océano.</p>
                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                            <span className="text-2xl font-bold text-gray-900">$250 <span className="text-sm text-gray-500 font-normal">/ noche</span></span>
                            <Link href="/rooms" className="px-5 py-2.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition font-medium">
                                Reservar
                            </Link>
                        </div>
                    </div>
                 </div>
                  {/* Carta */}
                 <div className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.33rem)] bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 group">
                    <div className="relative h-72 overflow-hidden">
                        <Image src="/img/banner.png" alt="Suite" fill className="object-cover group-hover:scale-105 transition duration-500" />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-rose-900 shadow-sm">Popular</div>
                    </div>
                    <div className="p-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Suite de Lujo</h3>
                        <p className="text-gray-600 mb-6 line-clamp-2">Espacio amplio con jacuzzi privado y vista panorámica al océano.</p>
                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                            <span className="text-2xl font-bold text-gray-900">$250 <span className="text-sm text-gray-500 font-normal">/ noche</span></span>
                            <Link href="/rooms" className="px-5 py-2.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition font-medium">
                                Reservar
                            </Link>
                        </div>
                    </div>
                 </div>
                 {/* Carta */}
                 <div className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.33rem)] bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 group">
                    <div className="relative h-72 overflow-hidden">
                        <Image src="/img/banner.png" alt="Suite" fill className="object-cover group-hover:scale-105 transition duration-500" />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-rose-900 shadow-sm">Popular</div>
                    </div>
                    <div className="p-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Suite de Lujo</h3>
                        <p className="text-gray-600 mb-6 line-clamp-2">Espacio amplio con jacuzzi privado y vista panorámica al océano.</p>
                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                            <span className="text-2xl font-bold text-gray-900">$250 <span className="text-sm text-gray-500 font-normal">/ noche</span></span>
                            <Link href="/rooms" className="px-5 py-2.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition font-medium">
                                Reservar
                            </Link>
                        </div>
                    </div>
                 </div>
                 {/* Agregar más cartas de habitaciones aquí */}
            </div>
        </div>
      </section>

      {/* footer */}
      <section className="py-24 bg-rose-900 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/img/banner.png')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">¿Listo para unas vacaciones inolvidables?</h2>
            <p className="text-xl text-rose-100 mb-10 max-w-2xl mx-auto">Reserva directamente con nosotros y obtén los mejores precios garantizados y beneficios exclusivos.</p>
            <Link href="/contact" className="bg-white text-rose-900 font-bold py-4 px-10 rounded-full hover:bg-rose-50 transition duration-300 shadow-xl inline-block">
                Contáctanos Hoy
            </Link>
        </div>
        </section>
    </main>
  );
}