// MOCK (Simulación) residual para evitar errores en archivos antiguos que aún lo importen
export const prisma = {
  room: {
    findMany: async () => [],
  }
} as any