import Joi from 'joi';

/**
 * Validation middleware factory
 */
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
      });
    }
    
    next();
  };
};

// Validation schemas
export const schemas = {
  register: Joi.object({
    name: Joi.string().trim().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    // FIXED: Added .allow('', null) to prevent 400 errors when referralCode is empty
    referralCode: Joi.string().trim().allow('', null).optional(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  createInvestment: Joi.object({
    amount: Joi.number().positive().required(),
    plan: Joi.string().valid('Starter', 'Pro', 'Premium').required(),
  }),
};