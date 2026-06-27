import { Router } from 'express';
import * as productsController from './products.controller.js';

export const productsRouter = Router();

productsRouter.get('/', productsController.list);
productsRouter.get('/:id/related', productsController.getRelated);
productsRouter.get('/:slug', productsController.getBySlug);

export const adminProductsRouter = Router();

adminProductsRouter.get('/', productsController.adminList);
adminProductsRouter.get('/:id', productsController.adminGet);
adminProductsRouter.post('/', productsController.adminCreate);
adminProductsRouter.patch('/:id', productsController.adminUpdate);
adminProductsRouter.delete('/:id', productsController.adminDelete);
