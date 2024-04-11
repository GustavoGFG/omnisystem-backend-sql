import { prisma } from '../libs/prisma';
import { Prisma } from '@prisma/client';

export const getAll = async () => {
  try {
    const salesGoal = await prisma.sale_goal.findMany();
    return salesGoal;
  } catch (error) {
    console.error('Error fetching Sales Goal:', error);
    return null;
  }
};

export const getSaleGoal = async (date: Date) => {
  try {
    const saleGoal = await prisma.sale_goal.findFirst({ where: { date } });
    return saleGoal;
  } catch (error) {
    console.error('Error fetching Sale Goal:', error);
    return null;
  }
};

type addSalesGoalParams = {
  date: Date;
  value_goal: number;
  transaction_goal: number;
  food_attach_goal: number;
  addons_goal: number;
};
export const add = async ({
  date,
  value_goal,
  transaction_goal,
  food_attach_goal,
  addons_goal,
}: addSalesGoalParams) => {
  try {
    const saleGoal = await prisma.sale_goal.create({
      data: {
        date,
        value_goal,
        transaction_goal,
        food_attach_goal,
        addons_goal,
      },
    });
    return saleGoal;
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
type updateSalesGoalsProps = {
  date_params: Date;
  date?: Date;
  value_goal?: number;
  transaction_goal?: number;
  food_attach_goal?: number;
  addons_goal?: number;
};
export const update = async ({
  date_params,
  date,
  value_goal,
  transaction_goal,
  food_attach_goal,
  addons_goal,
}: updateSalesGoalsProps) => {
  try {
    const updatedSaleGoal = await prisma.sale_goal.update({
      where: { date: date_params },
      data: {
        date,
        value_goal,
        transaction_goal,
        food_attach_goal,
        addons_goal,
      },
    });
    return updatedSaleGoal;
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

export const remove = async (date: Date) => {
  try {
    const deletedSaleGoal = await prisma.sale_goal.delete({ where: { date } });
    return deletedSaleGoal;
  } catch (error) {
    console.error('Error deleting Sale Goal:', error);
    return null;
  }
};
