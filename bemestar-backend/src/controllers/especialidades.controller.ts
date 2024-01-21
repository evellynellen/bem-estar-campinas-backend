import { Especialidade, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Essa funcao busca no banco de dados todas as especialidades
 * @returns {Promise<Especialidade[]>} especialidades - Todas as especialidades
 */
async function listarEspecialidades(): Promise<Especialidade[]> {
  return prisma.especialidade.findMany();
}

export default { listarEspecialidades };
