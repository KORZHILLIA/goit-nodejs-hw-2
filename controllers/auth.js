const fs = require("fs").promises;
const path = require("path");
const { findUser, createUser } = require("../services/auth");
const {
  createReqError,
  comparePasswords,
  makeToken,
  resize,
  sendMail,
} = require("../helpers");
const { validateUserBody, validateEmailBody } = require("../middlewares");
const { User } = require("../models");
const { message } = require("../models/joiModels/contact");
const { BASE_URL } = process.env;

const avatarsPath = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { body } = req;
  const user = await findUser(body.email);
  if (user) {
    throw createReqError(409, "Email in use");
  }
  validateUserBody(body);
  const { email, subscription, verificationToken } = await createUser(body);
  const mail = {
    to: email,
    from,
    subject: "Please, verify your e-mail",
    html: `<a href="${BASE_URL}/users/verify/${verificationToken}">Follow link to verify e-mail</a>`,
  };
  await sendMail(mail);

  res.status(201).json({
    email,
    subscription,
    verificationToken,
  });
};

const sendVerifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw createReqError(404, "User not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verificationToken: null,
    verify: true,
  });
  res.json({ message: "Verification successful" });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  validateEmailBody(body);
  const user = User.findOne({ email });
  if (!user) {
    throw createReqError(404, "User not found");
  }
  if (user.verify) {
    throw createReqError(400, "Verification has already been passed");
  }
  const { verificationToken } = user;
  const mail = {
    to: email,
    subject: "Please, verify your e-mail",
    html: `<a href="${BASE_URL}/users/verify/${verificationToken}">Follow link to verify e-mail</a>`,
  };
  await sendMail(mail);
  res.json({ message: "Verification email sent" });
};

const login = async (req, res) => {
  const { body } = req;
  validateUserBody(body);
  const user = await findUser(body.email);
  if (!user) {
    throw createReqError(401, "Email or password is wrong");
  }
  if (!user.verify) {
    throw createReqError(401, "Email is not verified");
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

module.exports = {
  register,
  login,
  sendVerifyEmail,
  resendVerifyEmail,
  getCurrentUser,
  logout,
  updateAvatar,
};
