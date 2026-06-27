import type { Request, Response, NextFunction } from 'express';
import * as couponsService from './coupons.service.js';
import {
  createCouponSchema,
  updateCouponSchema,
  validateCouponSchema,
} from './coupons.service.js';
import { sendSuccess } from '../../lib/apiResponse.js';
import { routeParam } from '../../lib/routeParams.js';

export async function validate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = validateCouponSchema.parse(req.body);
    const result = await couponsService.validateCoupon(input.code, input.subtotal);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function adminList(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const coupons = await couponsService.listCoupons();
    sendSuccess(res, coupons);
  } catch (error) {
    next(error);
  }
}

export async function adminCreate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = createCouponSchema.parse(req.body);
    const coupon = await couponsService.createCoupon(input);
    sendSuccess(res, coupon, 201);
  } catch (error) {
    next(error);
  }
}

export async function adminUpdate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = updateCouponSchema.parse(req.body);
    const coupon = await couponsService.updateCoupon(routeParam(req.params.id), input);
    sendSuccess(res, coupon);
  } catch (error) {
    next(error);
  }
}

export async function adminDelete(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await couponsService.deleteCoupon(routeParam(req.params.id));
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}
