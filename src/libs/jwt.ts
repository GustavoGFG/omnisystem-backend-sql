import jwt from 'jsonwebtoken';

export const generateToken = (cpf: string) => {
  return jwt.sign(cpf, process.env.JWT_SECRET as string);
};
