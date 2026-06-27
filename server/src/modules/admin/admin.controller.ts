import type { Request, Response, NextFunction } from 'express';
import * as adminService from './admin.service.js';
import { sendSuccess } from '../../lib/apiResponse.js';

export async function dashboard(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const metrics = await adminService.getDashboardMetrics();
    sendSuccess(res, metrics);
  } catch (error) {
    next(error);
  }
}

export async function customers(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const customers = await adminService.listCustomers();
    sendSuccess(res, customers);
  } catch (error) {
    next(error);
  }
}
