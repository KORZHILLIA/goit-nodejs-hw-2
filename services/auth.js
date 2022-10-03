const gravatar = require("gravatar");
const { User } = require("../models");
const { hashPassword } = require("../helpers");

const findUser = async (email) => {
  return User.findOne({ email });
};

const createUser = async ({ email, password }) => {
  const avatarURL = gravatar.url(email);
  return User.create({
    email,
    password: await hashPassword(password),
    avatarURL,
    subscription: "starter",
  });
};

const findUserByID = async (id) => {
  return User.findById(id);
};

module.exports = { findUser, createUser, findUserByID };
