import { Router } from 'express';
import * as ordersController from './orders.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { optionalAuthenticate } from '../../middleware/cartContext.js';

export const ordersRouter = Router();

ordersRouter.post('/', optionalAuthenticate, ordersController.create);
ordersRouter.get('/', authenticate, ordersController.listMine);
ordersRouter.get('/:id', authenticate, ordersController.getMine);
ordersRouter.post('/:id/cancel', authenticate, ordersController.cancel);

export const adminOrdersRouter = Router();

adminOrdersRouter.get('/', ordersController.adminList);
adminOrdersRouter.get('/:id', ordersController.adminGet);
adminOrdersRouter.patch('/:id/status', ordersController.adminUpdateStatus);
adminOrdersRouter.patch('/:id/payment-status', ordersController.adminUpdatePaymentStatus);
