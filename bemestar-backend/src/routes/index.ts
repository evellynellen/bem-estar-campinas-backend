import { Router } from "express";

import { agendamentoRouter } from "./agendamento.routes";
import { especialidadesRouter } from "./especialidades.routes";
import { pacientesRouter } from "./pacientes.routes";

const router = Router();

// Adicionando todas as rotas ao servidor
router.use("/", pacientesRouter, especialidadesRouter, agendamentoRouter);

export { router };
