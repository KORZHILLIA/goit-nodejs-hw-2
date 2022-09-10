const { createReqError } = require("../helpers");
const { contactJoiModel } = require("../models");

const validateReqBody = (body) => {
  const validationResult = contactJoiModel.validate(body);
  if (validationResult.error) {
    const { details } = validationResult.error;
    const [{ message }] = details;
    throw createReqError(400, message);
  }
};

module.exports = validateReqBody;
