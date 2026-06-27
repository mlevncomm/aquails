import { Router } from 'express';
import * as serviceSlotsController from './serviceSlots.controller.js';

export const serviceSlotsRouter = Router();

serviceSlotsRouter.get('/', serviceSlotsController.list);
serviceSlotsRouter.post('/book', serviceSlotsController.book);

export const adminServiceSlotsRouter = Router();

adminServiceSlotsRouter.get('/', serviceSlotsController.adminList);
adminServiceSlotsRouter.post('/', serviceSlotsController.adminCreate);
adminServiceSlotsRouter.patch('/:id', serviceSlotsController.adminUpdate);
adminServiceSlotsRouter.delete('/:id', serviceSlotsController.adminDelete);
