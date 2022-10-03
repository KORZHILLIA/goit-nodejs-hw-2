const fs = require("fs").promises;
const path = require("path");
const { findUser, createUser } = require("../services/auth");
const {
  createReqError,
  comparePasswords,
  makeToken,
  resize,
} = require("../helpers");
const { validateUserBody } = require("../middlewares");
const { User } = require("../models");

const avatarsPath = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { body } = req;
  const user = await findUser(body.email);
  if (user) {
    throw createReqError(409, "Email in use");
  }
  validateUserBody(body);
  const { email, subscription } = await createUser(body);
  res.status(201).json({
    email,
    subscription,
  });
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

const updateAvatar = async (req, res) => {
  const { path: tempPath, originalname } = req.file;
  const { _id } = req.user;
  const [fileExtension] = originalname.split(".").reverse();
  const newFileName = `${_id}.${fileExtension}`;
  const ultimateAvatarPath = path.join(avatarsPath, newFileName);
  await fs.rename(tempPath, ultimateAvatarPath);
  await resize(ultimateAvatarPath);
  const avatarURL = path.join("avatars", newFileName);
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.json({ avatarURL });
};

module.exports = { register, login, getCurrentUser, logout, updateAvatar };
