import { Especialidade, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const especialidades = [
    {
      name: "clinico geral",
    },
    {
      name: "ortopedista",
    },
    {
      name: "pediatria",
    },
    {
      name: "oftalmologista",
    },
    {
      name: "dermatologista",
    },
  ];

  console.log("Inserindo dados de especialidades no banco de dados...");

  for (const especialidade of especialidades) {
    await prisma.especialidade.create({
      data: especialidade,
    });
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
