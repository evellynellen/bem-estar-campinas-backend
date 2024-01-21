import { Request, Response, Router } from "express";

import patientController from "../controllers/pacientes.controller";
import {
  validaCadastroPaciente,
  validaLoginPaciente,
} from "../validations/paciente.validation";

const router = Router();

// Rota para efetuar o login do paciente
// A funcao validaLoginPaciente valida os parametros de entrada da rota
router.post(
  "/login",
  validaLoginPaciente,
  async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const result = await patientController.loginPaciente({
        email,
        password,
      });

      res.send(result);
    } catch (error) {
      res.status(500).send({
        error: error.message || "INTERNAL SERVER ERROR",
      });
    }
  }
);

// Rota para efetuar o cadastro do paciente
// A funcao validaCadastroPaciente valida os parametros de entrada da rota
router.post(
  "/register",
  validaCadastroPaciente,
  async (req: Request, res: Response) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        birthDate,
        address,
        city,
        state,
        phone,
        gender,
      } = req.body;

      const result = await patientController.cadastrarPaciente({
        firstName,
        lastName,
        email,
        password,
        birthDate,
        address,
        city,
        state,
        phone,
        gender,
      });

      res.send(result);
    } catch (error) {
      res.status(500).send({
        error: error.message || "INTERNAL SERVER ERROR",
      });
    }
  }
);

export { router as pacientesRouter };
