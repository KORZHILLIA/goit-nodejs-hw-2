const { validateReqBody, validateReqFavorite } = require("./validateReqBody");
const validateUserBody = require("./validateUserBody");
const validateEmailBody = require("./validateEmailBody");
const authenticate = require("./authenticate");
const upload = require("./upload");

module.exports = {
  validateReqBody,
  validateReqFavorite,
  validateUserBody,
  validateEmailBody,
  authenticate,
  upload,
};
