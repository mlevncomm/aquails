import type { Request, Response, NextFunction } from 'express';
import * as cartService from './cart.service.js';
import { addCartItemSchema, mergeCartSchema, updateCartItemSchema } from './cart.validation.js';
import { getCartSessionId } from '../../middleware/cartContext.js';
import { sendSuccess } from '../../lib/apiResponse.js';
import { routeParam } from '../../lib/routeParams.js';
import { authenticate } from '../../middleware/authenticate.js';

function resolveCartContext(req: Request) {
  return {
    userId: req.user?.id,
    sessionId: getCartSessionId(req),
  };
}

export async function getCart(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId, sessionId } = resolveCartContext(req);
    const cart = await cartService.getCart(userId, sessionId);
    sendSuccess(res, cart);
  } catch (error) {
    next(error);
  }
}

export async function addItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = addCartItemSchema.parse(req.body);
    const { userId, sessionId } = resolveCartContext(req);
    const cart = await cartService.addCartItem(
      input.productId,
      input.quantity,
      userId,
      sessionId,
    );
    sendSuccess(res, cart, 201);
  } catch (error) {
    next(error);
  }
}

export async function updateItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = updateCartItemSchema.parse(req.body);
    const { userId, sessionId } = resolveCartContext(req);
    const cart = await cartService.updateCartItem(
      routeParam(req.params.id),
      input.quantity,
      userId,
      sessionId,
    );
    sendSuccess(res, cart);
  } catch (error) {
    next(error);
  }
}

export async function removeItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId, sessionId } = resolveCartContext(req);
    const cart = await cartService.removeCartItem(routeParam(req.params.id), userId, sessionId);
    sendSuccess(res, cart);
  } catch (error) {
    next(error);
  }
}

export async function clear(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId, sessionId } = resolveCartContext(req);
    const cart = await cartService.clearCart(userId, sessionId);
    sendSuccess(res, cart);
  } catch (error) {
    next(error);
  }
}

export async function merge(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = mergeCartSchema.parse(req.body);
    const cart = await cartService.mergeGuestCart(req.user!.id, input.sessionId);
    sendSuccess(res, cart);
  } catch (error) {
    next(error);
  }
}

export { authenticate };
