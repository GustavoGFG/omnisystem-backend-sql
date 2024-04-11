import { RequestHandler } from 'express';
import { z } from 'zod';
import * as mistakeService from '../services/mistake';

export const getAll: RequestHandler = async (req, res) => {
  try {
    const mistakes = await mistakeService.getAll();
    if (mistakes)
      return res.status(200).json({ success: true, data: mistakes });
  } catch (error) {
    console.error('Error fetching Mistakes:', error);
    return res
      .status(500)
      .json({ success: false, error: 'Internal Server Error' });
  }
};
export const getOne: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const mistake = await mistakeService.getOne(parseInt(id));
    if (mistake) {
      return res.status(200).json({ success: true, data: mistake });
    } else {
      return res
        .status(404)
        .json({ success: false, error: 'Mistake not found' });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: 'Internal Server Error' });
  }
};
export const add: RequestHandler = async (req, res) => {
  const addMistakeSchema = z.object({
    date: z.date(),
    value: z.number().min(1),
    reason: z.string(),
    employee_id: z.number(),
    receipt: z.string(),
  });

  let { date, value, reason, employee_id, receipt } = req.body;
  date = date ? new Date(date) : date;
  const body = addMistakeSchema.safeParse({
    date,
    value,
    reason,
    employee_id,
    receipt,
  });
  if (!body.success)
    return res
      .status(400)
      .json({ success: false, error: 'Invalid data', details: body.error });

  try {
    const mistake = await mistakeService.add({
      date: body.data.date,
      value: body.data.value,
      reason: body.data.reason,
      receipt: body.data.receipt,
      employee: { connect: { id: body.data.employee_id } },
    });
    if (mistake) return res.status(201).json({ success: true, data: mistake });
  } catch (error: any) {
    if (
      error.message === 'Type is a unique constraint violation' ||
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
  reason: string;
  employee_id: number;
  receipt: string;
};
export const upsertMany: RequestHandler = async (req, res) => {
  const upsertManySchema = z.object({
    id: z.number(),
    date: z.date(),
    value: z.number().min(1),
    reason: z.string(),
    employee_id: z.number(),
    receipt: z.string(),
  });
  const arraySchema = z.array(upsertManySchema);

  const body = arraySchema.safeParse(
    req.body.map((mistake: upsertProp) => {
      return {
        id: mistake.id,
        date: new Date(mistake.date),
        value: mistake.value,
        reason: mistake.reason,
        employee_id: mistake.employee_id,
        receipt: mistake.receipt,
      };
    })
  );
  if (!body.success)
    return res
      .status(400)
      .json({ success: false, error: 'Invalid data', details: body.error });

  try {
    const upsertedSales = await mistakeService.upsertMany(body.data);
    if (upsertedSales) {
      return res.status(200).json({ success: true, data: upsertedSales });
    } else {
      return res
        .status(404)
        .json({ success: false, error: 'Mistake not found' });
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
  const updateMistakeSchema = z.object({
    date: z.date().optional(),
    value: z.number().min(1).optional(),
    reason: z.string().optional(),
    employee_id: z.number().optional(),
    receipt: z.string().optional(),
  });

  let { date, value, reason, employee_id, receipt } = req.body;
  date = date ? new Date(date) : date;
  const body = updateMistakeSchema.safeParse({
    date,
    value,
    reason,
    employee_id,
    receipt,
  });
  if (!body.success)
    return res
      .status(400)
      .json({ success: false, error: 'Invalid data', details: body.error });

  try {
    const updatedMistake = await mistakeService.update(
      {
        date,
        value,
        reason,
        receipt,
        employee: { connect: { id: employee_id } },
      },
      parseInt(id)
    );
    if (updatedMistake) {
      return res.status(200).json({ success: true, data: updatedMistake });
    } else {
      return res
        .status(404)
        .json({ success: false, error: 'Mistake not found' });
    }
  } catch (error: any) {
    if (
      error.message === 'There is a unique constraint violation' ||
      error.message === 'Employee not found' ||
      error.message === 'Record to update not found.'
    ) {
      return res.status(400).json({ success: false, error: error.message });
    }
    return res.status(500).json({
      success: false,
      error: `Internal Server Error: ${error.message}`,
    });
  }
};

export const remove: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedMistake = await mistakeService.remove(parseInt(id));
    if (deletedMistake) {
      return res.status(200).json({ success: true, data: deletedMistake });
    } else {
      return res
        .status(404)
        .json({ success: false, error: 'Mistake not found' });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: 'Internal Server Error' });
  }
};
