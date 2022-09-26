const Joi = require("joi");

const userJoiModel = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = userJoiModel;
