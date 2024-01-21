import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const cadastroSchema = Joi.object({
  firstName: Joi.string().min(3).max(30).required(),
  lastName: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  passwordConfirmation: Joi.ref("password"),
  birthDate: Joi.date().required(),
  address: Joi.string().min(3).max(30).required(),
  city: Joi.string().min(3).max(30).required(),
  state: Joi.string().min(3).max(30).required(),
  phone: Joi.string().length(11).required(),
  gender: Joi.string().min(3).max(30).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

export const validaCadastroPaciente = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = cadastroSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export const validaLoginPaciente = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
