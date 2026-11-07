/**
 * Standard API Response Utilities
 * Ensures uniform JSON envelope across all endpoints
 */

export const sendSuccess = (res, statusCode = 200, message = 'Success', data = null, meta = null) => {
  const payload = {
    success: true,
    message,
    data,
    ...(meta && { meta }),
    timestamp: new Date().toISOString()
  };
  return res.status(statusCode).json(payload);
};

export const sendError = (res, statusCode = 500, message = 'An unexpected error occurred', errors = null) => {
  const payload = {
    success: false,
    message,
    ...(errors && { errors }),
    timestamp: new Date().toISOString()
  };
  return res.status(statusCode).json(payload);
};

