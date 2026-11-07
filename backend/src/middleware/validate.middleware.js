/**
 * Generic Zod request validator middleware
 * Accepts schema object: { body?: ZodSchema, query?: ZodSchema, params?: ZodSchema }
 */
export const validate = (schema) => (req, res, next) => {
  try {
    if (schema.body) {
      req.body = schema.body.parse(req.body);
    }
    if (schema.query) {
      req.query = schema.query.parse(req.query);
    }
    if (schema.params) {
      req.params = schema.params.parse(req.params);
    }
    return next();
  } catch (err) {
    return next(err);
  }
};

