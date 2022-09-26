const { userJoiModel } = require("../models");
const { createValidationError } = require("./validateReqBody");

const validateUserBody = (body) => {
  const validationResult = userJoiModel.validate(body);
  createValidationError(validationResult);
};

module.exports = validateUserBody;
