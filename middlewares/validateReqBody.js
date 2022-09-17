const { createReqError } = require("../helpers");
const { contactJoiModel, favoriteJoiModel } = require("../models");

const validateReqBody = (body) => {
  const validationResult = contactJoiModel.validate(body);
  createValidationError(validationResult);
};

const validateReqFavorite = (body) => {
  const validationResult = favoriteJoiModel.validate(body);
  createValidationError(validationResult);
};

function createValidationError(validationResult) {
  if (validationResult.error) {
    const { details } = validationResult.error;
    const [{ message }] = details;
    throw createReqError(400, message);
  }
}

module.exports = { validateReqBody, validateReqFavorite };
