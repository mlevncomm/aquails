import { Router } from 'express';
import * as customersController from './customers.controller.js';
import { authenticate } from '../../middleware/authenticate.js';

export const customersRouter = Router();

customersRouter.use(authenticate);

customersRouter.get('/profile', customersController.getProfile);
customersRouter.patch('/profile', customersController.updateProfile);
customersRouter.get('/addresses', customersController.listAddresses);
customersRouter.post('/addresses', customersController.createAddress);
customersRouter.patch('/addresses/:id', customersController.updateAddress);
customersRouter.delete('/addresses/:id', customersController.deleteAddress);
