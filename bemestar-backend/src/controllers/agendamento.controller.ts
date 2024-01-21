import { Agendamento, PrismaClient } from "@prisma/client";

interface IGetAgendamentoProps {
  pacienteId: string;
  especialidadeId: number;
}

interface IGetAgendamentoDisponiveisProps {
  especialidadeId: number;
  dia: Date;
}

interface ICreateAgendamentoProps {
  pacienteId: string;
  especialidadeId: number;
  startsAt: Date;
}

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

/**
 * Essa funcao busca no banco de dados os horarios de agendamentos disponiveis para especialidade
 * @returns {Promise<Agendamento[]>} agendamentos - Agendamentos para a determinada especialidade
 */
async function listarAgendamentosDisponiveis(
  props: IGetAgendamentoDisponiveisProps
): Promise<string[]> {
  const { especialidadeId, dia } = props;

  // Busca todos os agendamentos da especialidade no dia especificado
  const agendamentos = await prisma.agendamento.findMany({
    where: {
      especialidadeId,
      startsAt: {
        gte: new Date(dia),
      },
    },
    include: {
      especialidade: true,
      paciente: true,
    },
  });

  // Define os possiveis horario de atendimento
  const hours = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
  ];

  // Para cada agendamento existente, remover dos horarios disponiveis
  for (const agendamento of agendamentos) {
    const hour = agendamento.startsAt.getHours().toString().padStart(2, "0");
    const minute = agendamento.startsAt
      .getMinutes()
      .toString()
      .padStart(2, "0");
    const time = `${hour}:${minute}`;

    const hourIndex = hours.findIndex((h) => h === time);
    hours.splice(hourIndex, 1);
  }

  return hours;
}

/**
 * Essa funcao busca no banco de dados os agendamentos para a especialidadeId fornecida
 * @returns {Promise<Agendamento[]>} agendamentos - Agendamentos para a determinada especialidade
 */
async function listarAgendamentos(pacienteId: string): Promise<Agendamento[]> {
  // Busca todos os agendamentos da especialidade
  const agendamentos = await prisma.agendamento.findMany({
    where: {
      pacienteId,
    },
    include: {
      especialidade: true,
      paciente: true,
    },
  });

  return agendamentos;
}

/**
 * Essa funcao valida se existe um agendamento no mesmo horario para a especialidade.
 * Caso sim, retorna um erro.
 * Caso nao, cria o novo agendamento no banco de dados
 * @param {ICreateAgendamentoProps} props - Parametros para criacao de agendamento
 * @returns {Promise<Agendamento>} agendamento - Novo agendamento criado
 */
async function criarAgendamento(
  props: ICreateAgendamentoProps
): Promise<Agendamento> {
  const { pacienteId, especialidadeId, startsAt } = props;

  // Busca se existe o paciente
  const pacienteExiste = await prisma.paciente.findFirst({
    where: { id: pacienteId },
  });
  if (!pacienteExiste) {
    throw new Error("Paciente nao existente");
  }

  // Busca se existe a especialidade
  const especialidadeExiste = await prisma.especialidade.findFirst({
    where: { id: especialidadeId },
  });
  if (!especialidadeExiste) {
    throw new Error("Especialidade nao existente");
  }

  // Busca se existe agendamento para a especialidade e horario
  const agendamento = await prisma.agendamento.findFirst({
    where: {
      especialidadeId,
      startsAt: {
        lte: new Date(startsAt),
      },
      endsAt: {
        gt: new Date(startsAt),
      },
    },
  });
  if (agendamento) {
    throw new Error("Horario indisponivel para agendamento");
  }

  // Cria o novo agendamento
  const novoAgendamento = await prisma.agendamento.create({
    data: {
      pacienteId,
      especialidadeId: especialidadeId,
      startsAt,
      endsAt: new Date(new Date(startsAt).getTime() + 30 * 60000),
    },
  });

  return novoAgendamento;
}

/**
 * Essa funcao valida se existe um agendamento.
 * Caso nao, retorna um erro.
 * Caso sim, remove o agendamento do banco de dados
 * @param {number} agendamentoId - Id do agendamento para remover
 * @returns {Promise<void>}
 */
async function removerAgendamento(agendamentoId: number): Promise<void> {
  // Busca se o agendamento existe
  const agendamento = await prisma.agendamento.findFirst({
    where: {
      id: agendamentoId,
    },
  });
  if (!agendamento) {
    throw new Error("Agendamento nao existe");
  }

  await prisma.agendamento.delete({
    where: {
      id: agendamentoId,
    },
  });
}

export default {
  listarAgendamentos,
  listarAgendamentosDisponiveis,
  criarAgendamento,
  removerAgendamento,
};
