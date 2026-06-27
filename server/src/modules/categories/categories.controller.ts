import type { Request, Response, NextFunction } from 'express';
import * as categoriesService from './categories.service.js';
import { createCategorySchema, updateCategorySchema } from './categories.service.js';
import { sendSuccess } from '../../lib/apiResponse.js';
import { routeParam } from '../../lib/routeParams.js';

export async function list(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const categories = await categoriesService.listCategories(true);
    sendSuccess(res, categories);
  } catch (error) {
    next(error);
  }
}

export async function getBySlug(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const category = await categoriesService.getCategoryBySlug(routeParam(req.params.slug));
    sendSuccess(res, category);
  } catch (error) {
    next(error);
  }
}

export async function adminList(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const categories = await categoriesService.listCategories(false);
    sendSuccess(res, categories);
  } catch (error) {
    next(error);
  }
}

export async function adminCreate(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const input = createCategorySchema.parse(req.body);
    const category = await categoriesService.createCategory(input);
    sendSuccess(res, category, 201);
  } catch (error) {
    next(error);
  }
}

export async function adminUpdate(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const input = updateCategorySchema.parse(req.body);
    const category = await categoriesService.updateCategory(routeParam(req.params.id), input);
    sendSuccess(res, category);
  } catch (error) {
    next(error);
  }
}

export async function adminDelete(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const category = await categoriesService.softDeleteCategory(routeParam(req.params.id));
    sendSuccess(res, category);
  } catch (error) {
    next(error);
  }
}
