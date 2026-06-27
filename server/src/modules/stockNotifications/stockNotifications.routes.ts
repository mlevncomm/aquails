import { Router } from 'express';
import * as stockNotificationsController from './stockNotifications.controller.js';

export const stockNotificationsRouter = Router();

stockNotificationsRouter.post('/', stockNotificationsController.create);

export const adminStockNotificationsRouter = Router();

adminStockNotificationsRouter.get('/', stockNotificationsController.adminList);
adminStockNotificationsRouter.patch(
  '/:id/mark-notified',
  stockNotificationsController.adminMarkNotified,
);
