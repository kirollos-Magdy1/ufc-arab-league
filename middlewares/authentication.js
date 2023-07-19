const { UnauthenticatedError, BadRequestError } = require("../errors");
const User = require("../models/User");
const { isTokenValid } = require("../utils/jwt");
const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  let token = null;
  const authHeader = req.headers.authorization;
  if (authHeader) token = authHeader.substring("Bearer ".length);
  console.log(token);

  if (!token) {
    throw new BadRequestError(
      "no token: authentication Invalid: no token provided"
    );
  }
  try {
    const userToken = isTokenValid(token);
    req.user = userToken;
    console.log(req.user);
    next();
  } catch (error) {
    console.log(error);
    throw new UnauthenticatedError("authentication Invalid: error");
  }
};

module.exports = { authenticate };
