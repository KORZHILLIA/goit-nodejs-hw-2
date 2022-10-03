const { validateReqBody, validateReqFavorite } = require("./validateReqBody");
const validateUserBody = require("./validateUserBody");
const authenticate = require("./authenticate");
const upload = require("./upload");

module.exports = {
  validateReqBody,
  validateReqFavorite,
  validateUserBody,
  authenticate,
  upload,
};
