import { Strategy, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { prisma } from './prisma';
import { RequestHandler } from 'express';

// Estende a interface Request do Express
declare global {
  namespace Express {
    interface Request {
      employee?: string; // ou o tipo correto de 'employee'
    }
  }
}

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET as string,
};

const strategy = new Strategy(options, async (payload, done) => {
  const employee = await prisma.employee.findFirst({
    where: { cpf: payload.cpf },
  });
  if (employee) {
    return done(null, employee);
  } else {
    // return done(res.status(401).json({error: 'Não autorizado'}));
    return done({ status: 401, message: 'Não autorizado' }, false);
  }
});

passport.use(strategy);

export const privateRoute: RequestHandler = (req, res, next) => {
  const authFunction = passport.authenticate(
    'jwt',
    (err: any, employee: string) => {
      if (err || !employee) {
        return res.status(401).json({ error: 'Não autorizado' });
      }
      req.employee = employee;
      next();
    }
  );
  authFunction(req, res, next);
};
