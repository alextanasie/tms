const Joi = require("@hapi/joi");

const addTimecardValidation = data => {
  const schema = Joi.object({
    task: Joi.string()
      .min(2)
      .max(255)
      .required(),
    date: Joi.string()
      .min(6)
      .required(),
    duration: Joi.string()
      .min(1)
      .required(),
    notes: Joi.string(),
  });

  return schema.validate(data);
};

module.exports = { addTimecardValidation };
