import type { Request, Response, NextFunction } from 'express';
import * as serviceSlotsService from './serviceSlots.service.js';
import { bookSlotSchema, createSlotSchema, updateSlotSchema } from './serviceSlots.service.js';
import { sendSuccess } from '../../lib/apiResponse.js';
import { routeParam } from '../../lib/routeParams.js';

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const date = typeof req.query.date === 'string' ? req.query.date : undefined;
    const slots = await serviceSlotsService.listSlots(date);
    sendSuccess(res, slots);
  } catch (error) {
    next(error);
  }
}

export async function book(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = bookSlotSchema.parse(req.body);
    const slot = await serviceSlotsService.bookSlot(input);
    sendSuccess(res, slot);
  } catch (error) {
    next(error);
  }
}

export async function adminList(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const slots = await serviceSlotsService.adminListSlots();
    sendSuccess(res, slots);
  } catch (error) {
    next(error);
  }
}

export async function adminCreate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = createSlotSchema.parse(req.body);
    const slot = await serviceSlotsService.adminCreateSlot(input);
    sendSuccess(res, slot, 201);
  } catch (error) {
    next(error);
  }
}

export async function adminUpdate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = updateSlotSchema.parse(req.body);
    const slot = await serviceSlotsService.adminUpdateSlot(routeParam(req.params.id), input);
    sendSuccess(res, slot);
  } catch (error) {
    next(error);
  }
}

export async function adminDelete(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await serviceSlotsService.adminDeleteSlot(routeParam(req.params.id));
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}
