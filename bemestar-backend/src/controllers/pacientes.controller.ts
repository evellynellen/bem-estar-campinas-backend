import { Paciente, PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";

interface ICadastrarPacienteProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDate: Date;
  address: string;
  city: string;
  state: string;
  phone: string;
  gender: string;
}

interface ILoginPacienteProps {
  email: string;
  password: string;
}

interface ILoginPacienteResponse {
  token: string;
  paciente: Paciente;
}

const prisma = new PrismaClient();

/**
 * Essa funcao cadastra um novo paciente
 * @param {ICadastrarPacienteProps} props - Parametros necessarios para cadastro do paciente
 * @returns {Promise<Paciente>} paciente - Novo paciente cadastrado
 */
async function cadastrarPaciente(
  props: ICadastrarPacienteProps
): Promise<Paciente> {
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
  } = props;

  // Busca paciente com o email
  const paciente = await prisma.paciente.findFirst({
    where: {
      email,
    },
  });

  // Valida se o paciente existe
  if (paciente) {
    throw new Error("Paciente com este email ja existe");
  }

  // Criptografa a senha
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Cria o novo paciente
  const novoPaciente = await prisma.paciente.create({
    data: {
      id: randomUUID(),
      name: firstName + " " + lastName,
      email,
      password: hashedPassword,
      birthDate: new Date(birthDate),
      address,
      city,
      state,
      phone,
      gender,
    },
  });

  return novoPaciente;
}

/**
 * Essa funcao realiza o login de um paciente
 * @param {ILoginPacienteProps} props - Parametros necessarios para login do paciente
 * @returns {Promise<ILoginPacienteResponse>} loginResponse - Resposta de login do paciente
 */
async function loginPaciente(
  props: ILoginPacienteProps
): Promise<ILoginPacienteResponse> {
  const { email, password } = props;

  // Busca paciente com o email
  const paciente = await prisma.paciente.findFirst({
    where: {
      email,
    },
  });

  // Valida se o paciente existe
  if (!paciente) {
    throw new Error("Credenciais incorretas");
  }

  // Compara a senha recebida com a senha criptografada do banco de dados
  const isMatch = bcrypt.compareSync(password, paciente.password);
  if (!isMatch) {
    throw new Error("Credenciais incorretas");
  }

  // Monta o token de autenticacao
  const token = jwt.sign(
    { sub: paciente.id },
    "dalskdjaskjdalskjfldjfldsjflkjsdfsdf"
  );

  return {
    token,
    paciente,
  };
}

export default {
  loginPaciente,
  cadastrarPaciente,
};
