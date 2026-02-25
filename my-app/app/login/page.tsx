import Image from 'next/image';
import Link from 'next/link';
// Define el componente principal de la página como una función asíncrona (Server Component)
export default async function RegisterPage() {
  // USA DATOS FALSOS EN LUGAR DE LA BASE DE DATOS
  // const rooms = await prisma.room.findMany(); 

  // Renderiza el contenido de la página
  return (
    // Contenedor principal con altura completa, relleno y color de fondo
    <main className="w-full">
        <section className="relative min-h-screen w-full">
        <div className="absolute inset-0">
            <Image
                src="/img/banner.png"
                alt="Hotel Quinta Dalam View"
                fill
                className="object-cover brightness-[0.65]"
                priority
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 px-4 text-center">
                <h2 className="text-4xl md:text-5xl mb-10 max-w-2xl drop-shadow-md font-bold">Iniciar Sesión</h2>
                
                <form className="bg-white p-8 rounded-xl shadow-md space-y-4">
                    <div>
                        <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                        <input type="email" name="correo" id="correo" className="w-full p-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500" />
                    </div>

                    <div>
                        <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                        <input type="password" name="contrasena" id="contrasena" className="w-full p-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500" />
                    </div>


                    <button type="submit" className="w-full bg-rose-600 text-white py-2 px-4 rounded-md hover:bg-rose-700 transition duration-200 font-medium mt-4">
                        Iniciar Sesión
                    </button>
                    <a href="/forgot-password" className="block text-center text-sm text-rose-600 hover:text-rose-800 mt-2">¿Olvidaste tu contraseña?</a>
                    <a href="/register" className="block text-center text-sm text-gray-600 hover:text-gray-800 mt-2">¿No tienes cuenta? Regístrate aquí</a>
                </form>
            </div>
        </div>
        </section>
    </main>
  );
}