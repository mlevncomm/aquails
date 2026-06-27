import type { Request, Response, NextFunction } from 'express';
import * as productsService from './products.service.js';
import {
  adminListProductsQuerySchema,
  createProductSchema,
  listProductsQuerySchema,
  updateProductSchema,
} from './products.validation.js';
import { sendSuccess } from '../../lib/apiResponse.js';
import { routeParam } from '../../lib/routeParams.js';

export async function list(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const query = listProductsQuerySchema.parse(req.query);
    const result = await productsService.listProducts(query);
    sendSuccess(res, result);
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
    const product = await productsService.getProductBySlug(routeParam(req.params.slug));
    sendSuccess(res, product);
  } catch (error) {
    next(error);
  }
}

export async function getRelated(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 4;
    const related = await productsService.getRelatedProducts(routeParam(req.params.id), limit);
    sendSuccess(res, related);
  } catch (error) {
    next(error);
  }
}

export async function adminList(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const query = adminListProductsQuerySchema.parse(req.query);
    const result = await productsService.listAdminProducts(query);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function adminGet(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const product = await productsService.getProductById(routeParam(req.params.id));
    sendSuccess(res, product);
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
    const input = createProductSchema.parse(req.body);
    const product = await productsService.createProduct(input);
    sendSuccess(res, product, 201);
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
    const input = updateProductSchema.parse(req.body);
    const product = await productsService.updateProduct(routeParam(req.params.id), input);
    sendSuccess(res, product);
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
    const product = await productsService.softDeleteProduct(routeParam(req.params.id));
    sendSuccess(res, product);
  } catch (error) {
    next(error);
  }
}
