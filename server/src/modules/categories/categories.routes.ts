import { Router } from 'express';
import * as categoriesController from './categories.controller.js';

export const categoriesRouter = Router();

categoriesRouter.get('/', categoriesController.list);
categoriesRouter.get('/:slug', categoriesController.getBySlug);

export const adminCategoriesRouter = Router();

adminCategoriesRouter.get('/', categoriesController.adminList);
adminCategoriesRouter.post('/', categoriesController.adminCreate);
adminCategoriesRouter.patch('/:id', categoriesController.adminUpdate);
adminCategoriesRouter.delete('/:id', categoriesController.adminDelete);
