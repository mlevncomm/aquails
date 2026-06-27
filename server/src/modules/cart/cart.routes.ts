import { Router } from 'express';
import * as cartController from './cart.controller.js';
import { optionalAuthenticate } from '../../middleware/cartContext.js';

export const cartRouter = Router();

cartRouter.use(optionalAuthenticate);

cartRouter.get('/', cartController.getCart);
cartRouter.post('/items', cartController.addItem);
cartRouter.patch('/items/:id', cartController.updateItem);
cartRouter.delete('/items/:id', cartController.removeItem);
cartRouter.delete('/', cartController.clear);
cartRouter.post('/merge', cartController.authenticate, cartController.merge);
