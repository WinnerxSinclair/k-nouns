// middleware/validate.js
export const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: 'validation failed',
      errors: result.error.flatten().fieldErrors,
    });
  }
  req.body = result.data; // already trimmed & cleaned
  next();
};

export const validateParams = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.params);
  if (!result.success) {
    return res.status(400).json({
      message: 'invalid route params',
      errors: result.error.flatten().fieldErrors,
    });
  }
  req.params = result.data;
  next();
};