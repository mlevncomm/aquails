import type { Request, Response, NextFunction } from 'express';
import * as stockNotificationsService from './stockNotifications.service.js';
import { createStockNotificationSchema } from './stockNotifications.service.js';
import { sendSuccess } from '../../lib/apiResponse.js';
import { routeParam } from '../../lib/routeParams.js';

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = createStockNotificationSchema.parse(req.body);
    const notification = await stockNotificationsService.createStockNotification(input);
    sendSuccess(res, notification, 201);
  } catch (error) {
    next(error);
  }
}

export async function adminList(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const notifications = await stockNotificationsService.adminListStockNotifications();
    sendSuccess(res, notifications);
  } catch (error) {
    next(error);
  }
}

export async function adminMarkNotified(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const notification = await stockNotificationsService.markStockNotificationNotified(
      routeParam(req.params.id),
    );
    sendSuccess(res, notification);
  } catch (error) {
    next(error);
  }
}
