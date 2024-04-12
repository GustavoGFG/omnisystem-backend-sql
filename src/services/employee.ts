import { prisma } from '../libs/prisma';
import { Employee, Prisma, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generateToken } from '../libs/jwt';

export const getAllEmployeeService = async () => {
  try {
    const employees = await prisma.employee.findMany();
    return employees;
  } catch (error) {
    console.error('Error fetching employees:', error);
    return null;
  }
};

export const getEmployeeService = async (id: number) => {
  try {
    const employee = await prisma.employee.findFirst({ where: { id } });
    return employee;
  } catch (error) {
    console.error('Error fetching employee:', error);
    return null;
  }
};

type AddEmployeeParams = {
  full_name: string;
  cpf: string;
  hire_date: Date;
  role: 'Cashier' | 'Coordinator' | 'Manager';
};
export const addEmployeeService = async ({
  full_name,
  cpf,
  hire_date,
  role,
}: AddEmployeeParams) => {
  try {
    const employee = await prisma.employee.create({
      data: {
        full_name,
        cpf,
        hire_date,
        role,
      },
    });
    return employee;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new Error('There is a unique constraint violation');
      }
    } else {
      throw error;
    }
    return null;
  }
};

type UpdateEmployeeParams = {
  id: number;
  full_name?: string;
  hire_date?: Date;
  resign_date?: Date | null;
  cpf?: string;
  image?: string;
  role?: 'Cashier' | 'Coordinator' | 'Manager';
};

export const updateEmployeeService = async ({
  id,
  full_name,
  hire_date,
  resign_date,
  cpf,
  image,
  role,
}: UpdateEmployeeParams): Promise<Employee | null> => {
  try {
    const employee = await prisma.employee.findFirst({ where: { id } });
    if (!employee) {
      throw new Error('Employee not found');
    }

    // Check if there's an existing employee with the new CPF
    if (cpf) {
      const existingEmployee = await prisma.employee.findFirst({
        where: { cpf },
      });
      if (existingEmployee && existingEmployee.id !== id) {
        throw new Error('CPF already exists');
      }
    }

    // Update the employee
    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: {
        full_name,
        hire_date,
        resign_date,
        cpf,
        image,
        role,
      },
    });

    return updatedEmployee;
  } catch (error) {
    console.error('Error updating employee:', error);
    return null;
  }
};

export const deleteEmployeeService = async (id: number) => {
  try {
    const deletedEmployee = await prisma.employee.delete({ where: { id } });
    return deletedEmployee;
  } catch (error) {
    console.error('Error deleting employee:', error);
    return null;
  }
};
