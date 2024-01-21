import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const listarAgendamentosDisponiveisSchema = Joi.object({
  especialidadeId: Joi.number().integer().required(),
  dia: Joi.date().required().greater(Date.now()),
});

const criarAgendamentoSchema = Joi.object({
  especialidadeId: Joi.number().integer().required(),
  startsAt: Joi.date().required().greater(Date.now()),
});

export const validaListarAgendamentosDisponveis = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = listarAgendamentosDisponiveisSchema.validate(req.query);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export const validaCriarAgendamento = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = criarAgendamentoSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
