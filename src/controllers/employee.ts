import { RequestHandler } from 'express';
import { z } from 'zod';

import * as employeeService from '../services/employee';

export const getAll: RequestHandler = async (req, res) => {
  try {
    const employees = await employeeService.getAllEmployeeService();
    if (employees) {
      return res.status(200).json({ success: true, data: employees });
    } else {
      return res
        .status(500)
        .json({ success: false, error: 'Failed to fetch employees' });
    }
  } catch (error) {
    console.error('Error fetching employees:', error);
    return res
      .status(500)
      .json({ success: false, error: 'Internal Server Error' });
  }
};

export const getEmployee: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await employeeService.getEmployeeService(parseInt(id));
    if (employee) {
      return res.status(200).json({ success: true, data: employee });
    } else {
      return res
        .status(404)
        .json({ success: false, error: 'Employee not found' });
    }
  } catch (error) {
    console.error('Error fetching employee:', error);
    return res
      .status(500)
      .json({ success: false, error: 'Internal Server Error' });
  }
};

export const addEmployee: RequestHandler = async (req, res) => {
  const addEmployeeSchema = z.object({
    full_name: z
      .string()
      .min(10)
      .max(50)
      .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)+$/),
    cpf: z.string().transform(val => val.replace(/\.|-/gm, '')),
    hire_date: z.date(),
    role: z.enum(['Cashier', 'Coordinator', 'Manager']),
  });

  const { full_name, cpf, role } = req.body;
  const hire_date = new Date(req.body.hire_date); // Convert hire_date string to Date object

  const body = addEmployeeSchema.safeParse({ full_name, cpf, hire_date, role });
  if (!body.success) {
    return res
      .status(400)
      .json({ success: false, error: 'Invalid data', details: body.error });
  }

  try {
    const employee = await employeeService.addEmployeeService(body.data);
    if (employee) {
      return res.status(200).json({ success: true, data: employee });
    } else {
      return res
        .status(500)
        .json({ success: false, error: 'Failed to add employee' });
    }
  } catch (error) {
    console.error('Error adding employee:', error);
    return res
      .status(500)
      .json({ success: false, error: 'Internal Server Error' });
  }
};

export const updateEmployee: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEmployeeSchema = z.object({
      full_name: z
        .string()
        .min(10)
        .max(50)
        .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)+$/)
        .optional(),
      hire_date: z.date().optional(),
      resign_date: z.date().nullable().optional(),
      cpf: z
        .string()
        .transform(val => val.replace(/\.|-/gm, ''))
        .optional(),
      image: z.string().optional(),
      role: z.enum(['Cashier', 'Coordinator', 'Manager']).optional(),
    });

    const { full_name, cpf, image, password, role } = req.body;
    const hire_date = req.body.hire_date
      ? new Date(req.body.hire_date)
      : undefined;
    const resign_date = req.body.resign_date
      ? new Date(req.body.resign_date)
      : null;

    if (resign_date && hire_date && resign_date < hire_date) {
      return res.status(400).json({ success: false, error: 'Invalid data' });
    }

    const body = updatedEmployeeSchema.safeParse({
      full_name,
      hire_date,
      resign_date,
      cpf,
      image,
      role,
    });

    if (!body.success) {
      return res
        .status(400)
        .json({ success: false, error: 'Invalid data', details: body.error });
    }

    const employee = await employeeService.updateEmployeeService({
      ...body.data,
      id: parseInt(id),
    });

    if (employee) {
      return res.status(200).json({ success: true, data: employee });
    } else {
      return res
        .status(500)
        .json({ success: false, error: 'Failed to update employee' });
    }
  } catch (error) {
    console.error('Error updating employee:', error);
    return res
      .status(500)
      .json({ success: false, error: 'Internal Server Error' });
  }
};

export const deleteEmployee: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEmployee = await employeeService.deleteEmployeeService(
      parseInt(id)
    );
    if (deletedEmployee) {
      return res.status(200).json({ success: true });
    } else {
      return res
        .status(404)
        .json({ success: false, error: 'Employee not found' });
    }
  } catch (error) {
    console.error('Error deleting employee:', error);
    return res
      .status(500)
      .json({ success: false, error: 'Internal Server Error' });
  }
};
