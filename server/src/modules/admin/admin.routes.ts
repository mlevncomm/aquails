import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { requireAdmin } from '../../middleware/requireAdmin.js';
import * as adminController from './admin.controller.js';
import { adminProductsRouter } from '../products/products.routes.js';
import { adminCategoriesRouter } from '../categories/categories.routes.js';
import { adminCouponsRouter } from '../coupons/coupons.routes.js';
import { adminOrdersRouter } from '../orders/orders.routes.js';
import { adminServiceSlotsRouter } from '../serviceSlots/serviceSlots.routes.js';
import { adminStockNotificationsRouter } from '../stockNotifications/stockNotifications.routes.js';

export const adminRouter = Router();

adminRouter.use(authenticate, requireAdmin);

adminRouter.get('/dashboard', adminController.dashboard);
adminRouter.get('/customers', adminController.customers);
adminRouter.use('/products', adminProductsRouter);
adminRouter.use('/categories', adminCategoriesRouter);
adminRouter.use('/coupons', adminCouponsRouter);
adminRouter.use('/orders', adminOrdersRouter);
adminRouter.use('/service-slots', adminServiceSlotsRouter);
adminRouter.use('/stock-notifications', adminStockNotificationsRouter);
