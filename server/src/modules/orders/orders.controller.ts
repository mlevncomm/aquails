import type { Request, Response, NextFunction } from 'express';
import * as ordersService from './orders.service.js';
import {
  createOrderSchema,
  updateOrderStatusSchema,
  updatePaymentStatusSchema,
} from './orders.service.js';
import { sendSuccess } from '../../lib/apiResponse.js';
import { routeParam } from '../../lib/routeParams.js';
import { getCartSessionId } from '../../middleware/cartContext.js';

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = createOrderSchema.parse({
      ...req.body,
      sessionId: req.body.sessionId ?? getCartSessionId(req),
    });
    const order = await ordersService.createOrder(input, req.user?.id);
    sendSuccess(res, order, 201);
  } catch (error) {
    next(error);
  }
}

export async function listMine(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const orders = await ordersService.listUserOrders(req.user!.id);
    sendSuccess(res, orders);
  } catch (error) {
    next(error);
  }
}

export async function getMine(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const order = await ordersService.getOrderById(routeParam(req.params.id), req.user!.id);
    sendSuccess(res, order);
  } catch (error) {
    next(error);
  }
}

export async function cancel(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const order = await ordersService.cancelOrder(routeParam(req.params.id), req.user!.id);
    sendSuccess(res, order);
  } catch (error) {
    next(error);
  }
}

export async function adminList(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await ordersService.listAdminOrders({
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 20,
      status: req.query.status as never,
    });
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function adminGet(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const order = await ordersService.getOrderById(routeParam(req.params.id), undefined, true);
    sendSuccess(res, order);
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateStatus(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const input = updateOrderStatusSchema.parse(req.body);
    const order = await ordersService.updateOrderStatus(routeParam(req.params.id), input.status);
    sendSuccess(res, order);
  } catch (error) {
    next(error);
  }
}

export async function adminUpdatePaymentStatus(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const input = updatePaymentStatusSchema.parse(req.body);
    const order = await ordersService.updatePaymentStatus(routeParam(req.params.id), input.paymentStatus);
    sendSuccess(res, order);
  } catch (error) {
    next(error);
  }
}
