import { Request, Response, Router } from "express";
import especialidadeController from "../controllers/especialidades.controller";

const router = Router();

// Rota para listar especialidades
router.get("/especialidades", async (req: Request, res: Response) => {
  try {
    const result = await especialidadeController.listarEspecialidades();
    res.send(result);
  } catch (error) {
    res.status(500).send({
      error: error.message || "INTERNAL SERVER ERROR",
    });
  }
});

export { router as especialidadesRouter };
