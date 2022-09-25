const { validateReqBody, validateReqFavorite } = require("./validateReqBody");
const validateUserBody = require("./validateUserBody");
const authenticate = require("./authenticate");

module.exports = {
  validateReqBody,
  validateReqFavorite,
  validateUserBody,
  authenticate,
};
