
// Define el componente principal de la página como una función asíncrona (Server Component)
export default async function RegisterPage() {
  // USA DATOS FALSOS EN LUGAR DE LA BASE DE DATOS
  // const rooms = await prisma.room.findMany(); 

  // Renderiza el contenido de la página
  return (
    // Contenedor principal con altura completa, relleno y color de fondo
    <main className="main-style-login">
        <div className="w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Registrarse</h2>
                
                <form className="bg-white p-8 rounded-xl shadow-md space-y-4">
                    <div>
                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                        <input type="text" name="nombre" id="nombre" className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    
                    <div>
                        <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                        <input type="tel" name="telefono" id="telefono" className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                    </div>

                    <div>
                        <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                        <input type="email" name="correo" id="correo" className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                    </div>

                    <div>
                        <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                        <input type="password" name="contrasena" id="contrasena" className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                    </div>

                    <div>
                        <label htmlFor="confirmar_contrasena" className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
                        <input type="password" name="confirmar_contrasena" id="confirmar_contrasena" className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 font-medium mt-4">
                        Registrarse
                    </button>
                </form>
        </div>
    </main>
  );
}