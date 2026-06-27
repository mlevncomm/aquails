import type { Response } from 'express';

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorBody {
  message: string;
  code: string;
  details?: unknown;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorBody;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode = 200,
): Response<ApiSuccessResponse<T>> {
  return res.status(statusCode).json({ success: true, data });
}

export function sendError(
  res: Response,
  message: string,
  code: string,
  statusCode = 500,
  details?: unknown,
): Response<ApiErrorResponse> {
  const error: ApiErrorBody = { message, code };

  if (details !== undefined) {
    error.details = details;
  }

  return res.status(statusCode).json({ success: false, error });
}
