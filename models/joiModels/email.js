const Joi = require("joi");

const emailJoiModel = Joi.object({
  email: Joi.string().required(),
});

module.exports = emailJoiModel;
