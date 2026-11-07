import { ZodError } from 'zod';
import { sendError } from '../utils/response.util.js';

export const errorHandler = (err, req, res, next) => {
  // 1. Zod Validation Error (handled before deep inspect to avoid Node v24 inspect issue)
  if (err instanceof ZodError) {
    const formattedErrors = err.errors?.map(e => ({
      field: e.path.join('.'),
      message: e.message
    })) || [];
    return sendError(res, 400, 'Validation failed. Please verify input fields.', formattedErrors);
  }

  // Safe logging for debugging
  console.error(`[Error] ${req.method} ${req.originalUrl}: ${err.message || err}`);

  // 2. Prisma Known Request Errors
  if (err.code === 'P2002') {
    const target = err.meta?.target ? ` (${err.meta.target.join(', ')})` : '';
    return sendError(res, 409, `A record with this unique value already exists${target}.`);
  }

  if (err.code === 'P2025') {
    return sendError(res, 404, 'Requested record was not found in the database.');
  }

  if (err.code === 'P2003') {
    return sendError(res, 400, 'Foreign key constraint violated: referenced entity does not exist.');
  }

  // 3. JWT Authentication Errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 401, 'Invalid authentication token. Please sign in again.');
  }

  if (err.name === 'TokenExpiredError') {
    return sendError(res, 401, 'Authentication token has expired. Please log in again.');
  }

  // 4. Custom status errors
  const statusCode = err.statusCode || (err.status ? Number(err.status) : 500);
  const message = err.message || 'Internal Server Error';

  return sendError(
    res,
    statusCode,
    message,
    process.env.NODE_ENV === 'development' ? err.stack : undefined
  );
};
