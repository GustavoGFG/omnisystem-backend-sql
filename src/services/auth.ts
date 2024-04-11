import { prisma } from '../libs/prisma';
import bcrypt from 'bcrypt';
import { generateToken } from '../libs/jwt';

type Data = {
  cpf: string;
  password: string;
};
export const signupService = async ({ cpf, password }: Data) => {
  const employee = await prisma.employee.findFirst({
    where: { cpf: cpf },
  });

  if (!employee) {
    throw new Error('Funcionário não encontrado');
  }

  if (employee.role === 'Cashier') {
    throw new Error('Cargo não administrativo');
  }

  if (employee.password !== null) {
    throw new Error('Funcionário já possui senha');
  }

  // HASH AND UPDATE PASSWORD
  const hashedPassword = await bcrypt.hash(password, 10);

  const updatedEmployee = await prisma.employee.update({
    where: { cpf: cpf },
    data: { password: hashedPassword },
  });

  if (!updatedEmployee) {
    throw new Error('Erro ao atualizar o usuário');
  }

  return { employee: updatedEmployee };
};

export const loginService = async ({ cpf, password }: Data) => {
  const employee = await prisma.employee.findFirst({
    where: { cpf },
  });

  if (!employee) {
    throw new Error('Funcionário não encontrado');
  }
  if (employee.password) {
    const matchPassword = await bcrypt.compare(password, employee.password);
    if (matchPassword) {
      let token = generateToken(cpf);
      return { token };
    } else {
      throw new Error('Dados inválidos');
    }
  } else {
    throw new Error('Senha não cadastrada');
  }
};
