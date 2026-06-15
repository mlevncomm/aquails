import { Router } from 'express';
import * as authController from './auth.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import {
  loginRateLimiter,
  registerRateLimiter,
} from '../../middleware/authRateLimit.js';

export const authRouter = Router();

authRouter.post(
  '/register',
  registerRateLimiter,
  authController.register,
);
authRouter.post('/login', loginRateLimiter, authController.login);
authRouter.get('/me', authenticate, authController.me);
authRouter.post('/logout', authenticate, authController.logout);
