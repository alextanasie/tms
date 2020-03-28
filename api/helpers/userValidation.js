const Joi = require("@hapi/joi");

// Register Validation

const registerValidation = data => {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .required(),
    email: Joi.string()
      .min(6)
      .required()
      .email(),
    password: Joi.string()
      .min(6)
      .required(),
    role: Joi.number()
      .min(1)
      .max(3),
  });

  return schema.validate(data);
};

const loginValidation = data => {
  const schema = Joi.object({
    email: Joi.string()
      .min(6)
      .required()
      .email(),
    password: Joi.string()
      .min(6)
      .required(),
  });

  return schema.validate(data);
};

const userInfoValidation = data => {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .required(),
    email: Joi.string()
      .min(6)
      .email()
      .required(),
    role: Joi.number()
      .min(1)
      .max(3),
  });

  return schema.validate(data);
};

module.exports = { registerValidation, loginValidation, userInfoValidation };
