import type { Request, Response } from 'express';
import { sendError } from '../lib/apiResponse.js';

export function notFoundHandler(_req: Request, res: Response): Response {
  return sendError(res, 'Rota bulunamadı', 'NOT_FOUND', 404);
}
