const contactJoiModel = require("./joiModels/contact");
const favoriteJoiModel = require("./joiModels/favorite");
const userJoiModel = require("./joiModels/user");
const Contact = require("./mongoModels/contact");
const User = require("./mongoModels/user");

module.exports = {
  contactJoiModel,
  favoriteJoiModel,
  userJoiModel,
  Contact,
  User,
};
