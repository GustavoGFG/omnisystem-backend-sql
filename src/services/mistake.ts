import { Prisma } from '@prisma/client';
import { prisma } from '../libs/prisma';

export const getAll = async () => {
  try {
    const mistakes = await prisma.mistake.findMany();
    return mistakes;
  } catch (error) {
    console.error('Error fetching Mistakes:', error);
    return null;
  }
};

export const getOne = async (id: number) => {
  try {
    const mistake = await prisma.mistake.findFirst({ where: { id } });
    return mistake;
  } catch (error) {
    console.error('Error fetching Mistake:', error);
    return null;
  }
};

export const add = async (data: Prisma.MistakeCreateInput) => {
  try {
    return await prisma.mistake.create({ data });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new Error('There is a unique constraint violation');
      }
      if (error.code === 'P2025') {
        throw new Error('Employee not found');
      }
    } else {
      throw error;
    }
    return null;
  }
};
type upsertProp = {
  id: number;
  date: Date;
  value: number;
  reason: string;
  employee_id: number;
  receipt: string;
};
export const upsertMany = async (data: upsertProp[]) => {
  try {
    const upsertPromises = data.map(async sale => {
      const { id, date, value, reason, receipt, employee_id } = sale;

      const upsertedSale = await prisma.mistake.upsert({
        where: { id },
        update: {
          date,
          value,
          reason,
          receipt,
          employee: { connect: { id: employee_id } },
        },
        create: {
          date,
          value,
          reason,
          receipt,
          employee: { connect: { id: employee_id } },
        },
      });
    });
    await Promise.all(upsertPromises);
    return upsertPromises;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new Error('There is a unique constraint violation');
      }
      if (error.code === 'P2025') {
        throw new Error('Employee not found');
      }
    } else {
      throw error;
    }
    return null;
  }
};

export const update = async (data: Prisma.MistakeUpdateInput, id: number) => {
  try {
    const updatedMistake = await prisma.mistake.update({
      where: { id },
      data,
    });
    return updatedMistake;
  } catch (error) {
    console.log(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new Error('There is a unique constraint violation');
      }
      if (error.code === 'P2025') {
        if (error?.meta?.cause === 'Record to update not found.') {
          throw new Error('Record to update not found.');
        }
        throw new Error('Employee not found');
      }
    } else {
      throw error;
    }
    return null;
  }
};

export const remove = async (id: number) => {
  try {
    const deletedMistake = await prisma.mistake.delete({ where: { id } });
    return deletedMistake;
  } catch (error) {
    console.error('Error deleting Mistake:', error);
    return null;
  }
};
