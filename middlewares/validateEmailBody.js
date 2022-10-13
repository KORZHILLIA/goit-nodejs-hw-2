const emailJoiModel = require("../models/joiModels/email");
const { createValidationError } = require("./validateReqBody");

const validateEmailBody = (body) => {
  const validationResult = emailJoiModel.validate(body);
  createValidationError(validationResult);
};

module.exports = validateEmailBody;
