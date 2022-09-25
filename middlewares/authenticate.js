const jwt = require("jsonwebtoken");
const { createReqError } = require("../helpers");
const { findUserByID } = require("../services/auth");
const { SECRET } = process.env;

const authenticate = async (req, res, next) => {
  try {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer") {
      throw createReqError(401, "Not authorized");
    }
    try {
      const { id } = jwt.verify(token, SECRET);
      const user = await findUserByID(id);
      if (!user || !user.token) {
        throw createReqError(401, "Not authorized");
      }
      req.user = user;
      next();
    } catch (error) {
      throw createReqError(401, "Not authorized");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = authenticate;
