const { findUser, createUser } = require("../services/auth");
const { createReqError, comparePasswords, makeToken } = require("../helpers");
const { validateUserBody } = require("../middlewares");
const { User } = require("../models");

const register = async (req, res) => {
  const { body } = req;
  const user = await findUser(body.email);
  if (user) {
    throw createReqError(409, "Email in use");
  }
  validateUserBody(body);
  const result = await createUser(body);
  res
    .status(201)
    .json({ email: result.email, subscription: result.subscription });
};

const login = async (req, res) => {
  const { body } = req;
  validateUserBody(body);
  const user = await findUser(body.email);
  if (!user) {
    throw createReqError(401, "Email or password is wrong");
  }
  const isPasswordsEqual = await comparePasswords(body.password, user.password);
  if (!isPasswordsEqual) {
    throw createReqError(401, "Password is wrong");
  }
  const token = makeToken(user._id, "1h");
  await User.findByIdAndUpdate(user._id, { token });
  const { email, subscription } = user;
  res.json({
    token,
    user: {
      email,
      subscription,
    },
  });
};

const getCurrentUser = (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204);
};

module.exports = { register, login, getCurrentUser, logout };
