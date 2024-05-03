import { prisma } from '../libs/prisma';
import bcrypt from 'bcrypt';
import { generateToken } from '../libs/jwt';

type Data = {
  cpf: string;
  password: string;
};
export const signupService = async ({ cpf, password }: Data) => {
  try {
    const employee = await prisma.employee.findFirst({
      where: { cpf: cpf },
    });

    if (!employee) {
      throw new Error('Funcionário não encontrado');
    }

    if (employee.role === 'Cashier') {
      throw new Error('Cargo não administrativo');
    }

    const existingPassword = await prisma.employee_password.findFirst({
      where: { employeeId: employee.id },
    });

    if (existingPassword) {
      throw new Error('Funcionário já possui senha');
    }

    // HASH AND CREATE PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    const createdPassword = await prisma.employee_password.create({
      data: {
        password: hashedPassword,
        employee: { connect: { id: employee.id } },
      },
    });
    if (createdPassword) {
      const token = generateToken(cpf);
      return { token };
    }
    throw new Error('Erro ao criar a senha do funcionário');
  } catch (error: any) {
    throw new Error('Erro ao criar a senha do funcionário: ' + error.message);
  }
};
export const loginService = async ({ cpf, password }: Data) => {
  const employee = await prisma.employee.findFirst({
    where: { cpf },
    include: { password: true }, // Include the related password
  });

  if (!employee) {
    throw new Error('Funcionário não encontrado');
  }

  if (!employee.password) {
    throw new Error('Senha não cadastrada');
  }

  const matchPassword = await bcrypt.compare(
    password,
    employee.password.password
  );
  if (!matchPassword) {
    throw new Error('Dados inválidos');
  }

  const token = generateToken(cpf);
  return { token };
};
