import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'tikakaran_default_fallback_secret_key_change_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Sign JWT Token with payload
 */
export const signToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};

/**
 * Verify JWT Token
 */
export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

