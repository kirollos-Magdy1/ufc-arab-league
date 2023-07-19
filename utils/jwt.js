const jwt = require("jsonwebtoken");

const createJWT = (tokenUser) => {
  return jwt.sign(tokenUser, process.env.JWT_SECRET, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = {
  createJWT,
  isTokenValid,
};
