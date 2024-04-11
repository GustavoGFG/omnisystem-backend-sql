import * as dailySalesService from '../services/dailysales';
import { RequestHandler } from 'express';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

export const getAll: RequestHandler = async (req, res) => {
  try {
    const sales = await dailySalesService.getAll();
    if (sales) return res.status(200).json({ success: true, data: sales });
  } catch (error) {
    console.error('Error fetching Sales Goal:', error);
    return res
      .status(500)
      .json({ success: false, error: 'Internal Server Error' });
  }
};
export const getOne: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const sale = await dailySalesService.getById(parseInt(id));
    if (sale) {
      return res.status(200).json({ success: true, data: sale });
    } else {
      return res.status(404).json({ success: false, error: 'Sale not found' });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: 'Internal Server Error' });
  }
};

export const add: RequestHandler = async (req, res) => {
  const addSaleSchema = z.object({
    date: z.date(),
    value: z.number().min(1),
    transaction: z.number().min(1),
    food_attach: z.number().min(0).max(1),
    addons: z.number().min(0).max(1),
    employee_id: z.number(),
  });

  const { value, transaction, food_attach, addons, employee_id } = req.body;
  const date = new Date(req.body.date);

  const body = addSaleSchema.safeParse({
    date,
    value,
    transaction,
    food_attach,
    addons,
    employee_id,
  });

  if (!body.success)
    return res
      .status(400)
      .json({ success: false, error: 'Invalid data', details: body.error });

  try {
    const sale = await dailySalesService.add({
      date: body.data.date,
      value: body.data.value,
      transaction: body.data.transaction,
      food_attach: body.data.food_attach,
      addons: body.data.addons,
      employee: { connect: { id: body.data.employee_id } },
    });
    if (sale) {
      return res.status(201).json({ success: true, data: sale });
    }
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

type addSaleProp = {
  date: string;
  value: number;
  transaction: number;
  food_attach: number;
  addons: number;
  employee_id: number;
};
export const addMany: RequestHandler = async (req, res) => {
  const addSaleSchema = z.object({
    date: z.date(),
    value: z.number().min(1),
    transaction: z.number().min(1),
    food_attach: z.number().min(0).max(1),
    addons: z.number().min(0).max(1),
    employee_id: z.number(),
  });

  const arraySchema = z.array(addSaleSchema);

  let newReqBody = req.body.map((sale: addSaleProp) => {
    return {
      date: sale.date ? new Date(sale.date) : sale.date,
      value: sale.value,
      transaction: sale.transaction,
      food_attach: sale.food_attach,
      addons: sale.addons,
      employee_id: sale.employee_id,
    };
  });
  const body = arraySchema.safeParse(newReqBody);
  if (!body.success)
    return res
      .status(400)
      .json({ success: false, error: 'Invalid data', details: body.error });

  try {
    const dailySales = await dailySalesService.addMany(body.data);
    if (dailySales)
      return res.status(201).json({ success: true, data: dailySales });
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

type upsertProp = {
  id: number;
  date: Date | string;
  value: number;
  transaction: number;
  food_attach: number;
  addons: number;
  employee_id: number;
};
export const upsertMany: RequestHandler = async (req, res) => {
  const upsertManySchema = z.object({
    id: z.number(),
    date: z.date(),
    value: z.number().min(1),
    transaction: z.number().min(1),
    food_attach: z.number().min(0).max(1),
    addons: z.number().min(0).max(1),
    employee_id: z.number(),
  });
  const arraySchema = z.array(upsertManySchema);

  const body = arraySchema.safeParse(
    req.body.map((sale: upsertProp) => {
      return {
        id: sale.id,
        date: new Date(sale.date),
        value: sale.value,
        transaction: sale.transaction,
        food_attach: sale.food_attach,
        addons: sale.addons,
        employee_id: sale.employee_id,
      };
    })
  );
  if (!body.success)
    return res
      .status(400)
      .json({ success: false, error: 'Invalid data', details: body.error });

  try {
    const upsertedSales = await dailySalesService.upsertMany(body.data);
    if (upsertedSales) {
      return res.status(200).json({ success: true, data: upsertedSales });
    } else {
      return res.status(404).json({ success: false, error: 'Sale not found' });
    }
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

export const update: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const updateSaleSchema = z.object({
    date: z.date().optional(),
    value: z.number().min(1).optional(),
    transactions: z.number().min(1).optional(),
    addons: z.number().min(0).max(1).optional(),
    food_attach: z.number().min(0).max(1).optional(),
    employee_id: z.number().optional(),
  });

  let { date, value, transactions, addons, food_attach, employee_id } =
    req.body;

  date = date ? new Date(req.body.date) : undefined;

  const body = updateSaleSchema.safeParse({
    date,
    value,
    transactions,
    addons,
    food_attach,
    employee_id,
  });
  if (!body.success)
    return res
      .status(400)
      .json({ success: false, error: 'Invalid data', details: body.error });
  try {
    const updatedSale = await dailySalesService.update(
      {
        date: body.data.date,
        value: body.data.value,
        transaction: body.data.transactions,
        food_attach: body.data.food_attach,
        addons: body.data.addons,
        employee: employee_id
          ? { connect: { id: body.data.employee_id } }
          : undefined,
      },
      parseInt(id)
    );
    if (updatedSale) {
      return res.status(200).json({ success: true, data: updatedSale });
    } else {
      return res.status(404).json({ success: false, error: 'Sale not found' });
    }
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

export const remove: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedSale = await dailySalesService.remove(parseInt(id));
    if (deletedSale) {
      return res.status(200).json({ success: true, data: deletedSale });
    } else {
      return res.status(404).json({ success: false, error: 'Sale not found' });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: 'Internal Server Error' });
  }
};
