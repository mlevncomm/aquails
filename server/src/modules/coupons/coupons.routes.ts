import { Router } from 'express';
import * as couponsController from './coupons.controller.js';

export const couponsRouter = Router();

couponsRouter.post('/validate', couponsController.validate);

export const adminCouponsRouter = Router();

adminCouponsRouter.get('/', couponsController.adminList);
adminCouponsRouter.post('/', couponsController.adminCreate);
adminCouponsRouter.patch('/:id', couponsController.adminUpdate);
adminCouponsRouter.delete('/:id', couponsController.adminDelete);
