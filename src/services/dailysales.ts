import { Prisma } from '@prisma/client';
import { prisma } from '../libs/prisma';

export const getAll = async () => {
  try {
    const sales = await prisma.sale.findMany();
    return sales;
  } catch (error) {
    console.error('Error fetching Sales Goal:', error);
    return null;
  }
};

export const getById = async (id: number) => {
  try {
    const sale = await prisma.sale.findFirst({ where: { id } });
    return sale;
  } catch (error) {
    console.error('Error fetching Sale:', error);
    return null;
  }
};

export const add = async (data: Prisma.SaleCreateInput) => {
  try {
    const sale = await prisma.sale.create({ data });
    return sale;
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

export const addMany = async (saleArray: Prisma.SaleCreateManyInput[]) => {
  try {
    const sales = await prisma.sale.createMany({ data: saleArray });

    return sales;
  } catch (error) {
    console.log(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new Error('There is a unique constraint violation');
      }
      if (error.code === 'P2025' || error.code === 'P2003') {
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
  transaction: number;
  food_attach: number;
  addons: number;
  employee_id: number;
};
export const upsertMany = async (data: upsertProp[]) => {
  try {
    const upsertPromises = data.map(async sale => {
      const { id, date, value, transaction, food_attach, addons, employee_id } =
        sale;

      const upsertedSale = await prisma.sale.upsert({
        where: { id },
        update: {
          date,
          value,
          transaction,
          food_attach,
          addons,
          employee: { connect: { id: employee_id } },
        },
        create: {
          date,
          value,
          transaction,
          food_attach,
          addons,
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

export const update = async (data: Prisma.SaleUpdateInput, id: number) => {
  try {
    const updatedSale = prisma.sale.update({
      where: { id },
      data,
    });
    return updatedSale;
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

export const remove = async (id: number) => {
  try {
    const deletedSale = await prisma.sale.delete({ where: { id } });
    return deletedSale;
  } catch (error) {
    console.error('Error deleting Sale Goal:', error);
    return null;
  }
};
