import { RequestHandler } from 'express';
import { z } from 'zod';
import * as auth from '../services/auth';

export const signup: RequestHandler = async (req, res) => {
  // VALIDATE BODY
  const signupSchema = z.object({
    cpf: z.string().transform(val => val.replace(/\.|-/gm, '')),
    password: z
      .string()
      .min(8, 'Min 8 characters')
      .max(20, 'Max 20 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,20}$/,
        'Password must contain at least 1 uppercase, 1 lowercase,, 1 number and 1 of (@#$%&)'
      ),
  });

  const body = signupSchema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: 'Dados inválidos' });

  try {
    const response = await auth.signupService(body.data);
    res.status(200).json({ employee: response.employee });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login: RequestHandler = async (req, res) => {
  // VALIDATE BODY
  const signupSchema = z.object({
    cpf: z.string().transform(val => val.replace(/\.|-/gm, '')),
    password: z
      .string()
      .min(8, 'Min 8 characters')
      .max(20, 'Max 20 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,20}$/,
        'Password must contain at least 1 uppercase, 1 lowercase,, 1 number and 1 of (@#$%&)'
      ),
  });

  const body = signupSchema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: 'Dados inválidos' });

  try {
    const response = await auth.loginService(body.data);
    res.status(200).json({ token: response.token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
