const jwt = require("jsonwebtoken");
const { SECRET } = process.env;

const makeToken = (id, expiresIn) => {
  const token = jwt.sign({ id }, SECRET, { expiresIn });
  return token;
};

module.exports = { makeToken };
