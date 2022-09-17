const Joi = require("joi");

const favoriteJoiModel = Joi.object({
  favorite: Joi.boolean().required(),
});

module.exports = favoriteJoiModel;
