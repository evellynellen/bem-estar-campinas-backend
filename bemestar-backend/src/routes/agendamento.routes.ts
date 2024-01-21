import { Request, Response, Router } from "express";
import agendamentoController from "../controllers/agendamento.controller";
import {
  validaCriarAgendamento,
  validaListarAgendamentosDisponveis,
} from "../validations/agendamento.validation";

const router = Router();

// Rota para listagem de agendamentos disponiveis
// A funcao validaListarAgendamento valida os parametros de entrada da rota
router.get(
  "/agendamentos",
  validaListarAgendamentosDisponveis,
  async (req: Request, res: Response) => {
    try {
      const { especialidadeId, dia } = req.query;
      console.log(dia);

      const result = await agendamentoController.listarAgendamentosDisponiveis({
        especialidadeId: Number(especialidadeId),
        dia: new Date(String(dia)),
      });
      res.send(result);
    } catch (error) {
      res.status(500).send({
        error: error.message || "INTERNAL SERVER ERROR",
      });
    }
  }
);

// Rota para listagem de agendamentos
// A funcao validaListarAgendamento valida os parametros de entrada da rota
router.get(
  "/paciente/:pacienteId/agendamentos",
  async (req: Request, res: Response) => {
    try {
      const { pacienteId } = req.params;
      const result = await agendamentoController.listarAgendamentos(pacienteId);
      res.send(result);
    } catch (error) {
      res.status(500).send({
        error: error.message || "INTERNAL SERVER ERROR",
      });
    }
  }
);

// Rota para criar de agendamentos
// A funcao validaCriarAgendamento valida os parametros de entrada da rota
router.post(
  "/paciente/:pacienteId/agendamentos",
  validaCriarAgendamento,
  async (req: Request, res: Response) => {
    try {
      const { pacienteId } = req.params;
      const { especialidadeId, startsAt } = req.body;
      const result = await agendamentoController.criarAgendamento({
        pacienteId,
        especialidadeId,
        startsAt,
      });
      res.send(result);
    } catch (error) {
      res.status(500).send({
        error: error.message || "INTERNAL SERVER ERROR",
      });
    }
  }
);

// Rota para remover um agendamento
router.delete(
  "/agendamentos/:agendamentoId",
  async (req: Request, res: Response) => {
    try {
      const { agendamentoId } = req.params;
      const result = await agendamentoController.removerAgendamento(
        Number(agendamentoId)
      );
      res.send(result);
    } catch (error) {
      res.status(500).send({
        error: error.message || "INTERNAL SERVER ERROR",
      });
    }
  }
);

export { router as agendamentoRouter };
