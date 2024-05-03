import * as salesGoalService from './../services/salesgoal';
import { RequestHandler } from 'express';
import { z } from 'zod';

export const getAll: RequestHandler = async (req, res) => {
  try {
    const salesGoal = await salesGoalService.getAll();
    if (salesGoal) {
      return res.status(200).json({ success: true, data: salesGoal });
    } else {
      return res
        .status(500)
        .json({ success: false, error: 'Failed to fetch Sales Goal' });
    }
  } catch (error) {
    console.error('Error fetching Sales Goal:', error);
    return res
      .status(500)
      .json({ success: false, error: 'Internal Server Error' });
  }
};

export const getSaleGoal: RequestHandler = async (req, res) => {
  try {
    const { saledate } = req.params;
    const getSaleGoalSchema = z.object({
      date: z.date(),
    });

    const formatDate = new Date(saledate);
    const body = getSaleGoalSchema.safeParse({ date: formatDate });
    if (!body.success)
      return res
        .status(400)
        .json({ success: false, error: 'Invalid data', details: body.error });

    const saleGoal = await salesGoalService.getSaleGoal(body.data.date);
    if (saleGoal) {
      return res.status(200).json({ success: true, data: saleGoal });
    } else {
      return res
        .status(500)
        .json({ success: false, error: 'Failed to fetch Sale Goal' });
    }
  } catch (error) {
    console.error('Error fetching Sale Goal:', error);
    return res
      .status(500)
      .json({ success: false, error: 'Internal Server Error' });
  }
};

export const addSaleGoal: RequestHandler = async (req, res) => {
  console.log('body: ', req.body);
  const addSaleGoalSchema = z.object({
    date: z.date(),
    value_goal: z.number().min(1, 'Deve ser no mínimo 1'),
    transaction_goal: z.number().min(1, 'Deve ser no mínimo 1'),
    food_attach_goal: z
      .number()
      .min(0, 'Deve ser no mínimo 0')
      .max(1, 'Dever ser no máximo 1'),
    addons_goal: z
      .number()
      .min(0, 'Deve ser no mínimo 0')
      .max(1, 'Dever ser no máximo 1'),
  });

  const { value_goal, transaction_goal, food_attach_goal, addons_goal } =
    req.body;
  const date = new Date(req.body.date);
  console.log(date);
  const body = addSaleGoalSchema.safeParse({
    date,
    value_goal,
    transaction_goal,
    food_attach_goal,
    addons_goal,
  });
  if (!body.success)
    return res
      .status(400)
      .json({ success: false, error: 'Invalid data', details: body.error });

  try {
    const saleGoal = await salesGoalService.add(body.data);
    if (saleGoal) {
      return res.status(200).json({ success: true, data: saleGoal });
    } else {
      return res
        .status(500)
        .json({ success: false, error: 'Failed to add sale goal' });
    }
  } catch (error: any) {
    if (error.message === 'There is a unique constraint violation') {
      return res.status(400).json({ success: false, error: error.message });
    }
    return res
      .status(500)
      .json({ success: false, error: 'Internal Server Error' });
  }
};
//

type addGoalProp = {
  date: string;
  value_goal: number;
  transaction_goal: number;
  food_attach_goal: number;
  addons_goal: number;
};
//
//
const addSaleGoalSchema = z.object({
  date: z.date(),
  value_goal: z.number().min(1, 'Deve ser no mínimo 1'),
  transaction_goal: z.number().min(1, 'Deve ser no mínimo 1'),
  food_attach_goal: z
    .number()
    .min(0, 'Deve ser no mínimo 0')
    .max(1, 'Dever ser no máximo 1'),
  addons_goal: z
    .number()
    .min(0, 'Deve ser no mínimo 0')
    .max(1, 'Dever ser no máximo 1'),
});
//
//
export const addMany: RequestHandler = async (req, res) => {
  const addSaleGoalSchema = z.object({
    date: z.date(),
    value_goal: z.number().min(1, 'Deve ser no mínimo 1'),
    transaction_goal: z.number().min(1, 'Deve ser no mínimo 1'),
    food_attach_goal: z
      .number()
      .min(0, 'Deve ser no mínimo 0')
      .max(1, 'Dever ser no máximo 1'),
    addons_goal: z
      .number()
      .min(0, 'Deve ser no mínimo 0')
      .max(1, 'Dever ser no máximo 1'),
  });

  const arraySchema = z.array(addSaleGoalSchema);

  let newReqBody = req.body.map((sale: addGoalProp) => {
    return {
      date: sale.date ? new Date(sale.date) : sale.date,
      value_goal: sale.value_goal,
      transaction_goal: sale.transaction_goal,
      food_attach_goal: sale.food_attach_goal,
      addons_goal: sale.addons_goal,
    };
  });
  const body = arraySchema.safeParse(newReqBody);
  if (!body.success)
    return res
      .status(400)
      .json({ success: false, error: 'Invalid data', details: body.error });

  try {
    const goals = await salesGoalService.addMany(body.data);
    if (goals) return res.status(201).json({ success: true, data: goals });
  } catch (error: any) {
    if (
      error.message === 'There is a unique constraint violation' ||
      error.message === 'Employee not found'
    ) {
      return res.status(400).json({ success: false, error: error.message });
    }
    return res
      .status(500)
      .json({ success: false, error: 'Internal Server Error' });
  }
};
//
export const updateSaleGoal: RequestHandler = async (req, res) => {
  try {
    const { saledate } = req.params;

    const updateSaleGoalSchema = z.object({
      date_params: z.date(),
      date: z.date().optional(),
      value_goal: z.number().min(1, 'Deve ser no mínimo 1').optional(),
      transaction_goal: z.number().min(1, 'Deve ser no mínimo 1').optional(),
      food_attach_goal: z
        .number()
        .min(0, 'Deve ser no mínimo 0')
        .max(1, 'Dever ser no máximo 1')
        .optional(),
      addons_goal: z
        .number()
        .min(0, 'Deve ser no mínimo 0')
        .max(1, 'Dever ser no máximo 1')
        .optional(),
    });

    let { date, value_goal, transaction_goal, food_attach_goal, addons_goal } =
      req.body;
    const formatSaleDate = new Date(saledate);
    date = new Date(date);
    const body = updateSaleGoalSchema.safeParse({
      date_params: formatSaleDate,
      date: date,
      value_goal,
      transaction_goal,
      food_attach_goal,
      addons_goal,
    });
    if (!body.success)
      return res
        .status(400)
        .json({ success: false, error: 'Invalid data', details: body.error });

    const updatedSaleGoal = await salesGoalService.update(body.data);
    if (updatedSaleGoal) {
      return res.status(200).json({ success: true, data: updatedSaleGoal });
    }
  } catch (error: any) {
    if (error.message === 'There is a unique constraint violation') {
      return res.status(400).json({ success: false, error: error.message });
    }
    return res
      .status(500)
      .json({ success: false, error: `Internal Server Error` });
  }
};

export const deleteSaleGoal: RequestHandler = async (req, res) => {
  try {
    const { date } = req.params;
    const deleteSalesGoalSchema = z.object({
      date: z.date(),
    });

    const formatDate = new Date(date);
    const body = deleteSalesGoalSchema.safeParse({ date: formatDate });
    if (!body.success)
      return res
        .status(400)
        .json({ success: false, error: 'Invalid data', details: body.error });

    const deletedSaleGoal = salesGoalService.remove(body.data.date);
    return res.status(200).json({ success: true, data: deletedSaleGoal });
  } catch (error) {
    console.error('Error deleting Sale Goal:', error);
    return res
      .status(500)
      .json({ success: false, error: 'Internal Server Error' });
  }
};
