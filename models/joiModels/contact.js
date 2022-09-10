const Joi = require("joi");

const contactJoiModel = Joi.object({
  name: Joi.string().pattern(new RegExp("^[A-Z]{1}[a-z]+\\s[A-Z]{1}[a-z]+$")),
  email: Joi.string().email(),
  phone: Joi.string().pattern(new RegExp("^\\(\\d{3}\\)\\s\\d{3}[-]\\d{4}$")),
  favorite: Joi.boolean(),
});

module.exports = contactJoiModel;
