import type { Request, Response, NextFunction } from 'express';
import * as customersService from './customers.service.js';
import {
  createAddressSchema,
  updateAddressSchema,
  updateProfileSchema,
} from './customers.service.js';
import { sendSuccess } from '../../lib/apiResponse.js';
import { routeParam } from '../../lib/routeParams.js';

export async function getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const profile = await customersService.getProfile(req.user!.id);
    sendSuccess(res, profile);
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = updateProfileSchema.parse(req.body);
    const profile = await customersService.updateProfile(req.user!.id, input);
    sendSuccess(res, profile);
  } catch (error) {
    next(error);
  }
}

export async function listAddresses(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const addresses = await customersService.listAddresses(req.user!.id);
    sendSuccess(res, addresses);
  } catch (error) {
    next(error);
  }
}

export async function createAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = createAddressSchema.parse(req.body);
    const address = await customersService.createAddress(req.user!.id, input);
    sendSuccess(res, address, 201);
  } catch (error) {
    next(error);
  }
}

export async function updateAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = updateAddressSchema.parse(req.body);
    const address = await customersService.updateAddress(req.user!.id, routeParam(req.params.id), input);
    sendSuccess(res, address);
  } catch (error) {
    next(error);
  }
}

export async function deleteAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await customersService.deleteAddress(req.user!.id, routeParam(req.params.id));
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}
