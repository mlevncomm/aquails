import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { sendSuccess } from './lib/apiResponse.js';
import { checkDatabaseConnection } from './lib/prisma.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { productsRouter } from './modules/products/products.routes.js';
import { categoriesRouter } from './modules/categories/categories.routes.js';
import { cartRouter } from './modules/cart/cart.routes.js';
import { couponsRouter } from './modules/coupons/coupons.routes.js';
import { ordersRouter } from './modules/orders/orders.routes.js';
import { customersRouter } from './modules/customers/customers.routes.js';
import { serviceSlotsRouter } from './modules/serviceSlots/serviceSlots.routes.js';
import { stockNotificationsRouter } from './modules/stockNotifications/stockNotifications.routes.js';
import { adminRouter } from './modules/admin/admin.routes.js';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGINS,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

  app.get('/api/health', async (_req, res) => {
    let database: 'connected' | 'disconnected' | 'not_configured';

    if (!env.DATABASE_URL) {
      database = 'not_configured';
    } else {
      const isConnected = await checkDatabaseConnection();
      database = isConnected ? 'connected' : 'disconnected';
    }

    return sendSuccess(res, {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      database,
    });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/products', productsRouter);
  app.use('/api/categories', categoriesRouter);
  app.use('/api/cart', cartRouter);
  app.use('/api/coupons', couponsRouter);
  app.use('/api/orders', ordersRouter);
  app.use('/api/customers', customersRouter);
  app.use('/api/service-slots', serviceSlotsRouter);
  app.use('/api/stock-notifications', stockNotificationsRouter);
  app.use('/api/admin', adminRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
