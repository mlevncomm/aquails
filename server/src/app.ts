import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { sendSuccess } from './lib/apiResponse.js';
import { checkDatabaseConnection } from './lib/prisma.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

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

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
