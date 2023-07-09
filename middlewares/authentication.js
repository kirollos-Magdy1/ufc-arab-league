const { UnauthenticatedError } = require("../errors");

const authenticate = async (req, res, next) => {
  if (!req.user) {
    throw new UnauthenticatedError("please login");
  }

  next();
};

module.exports = { authenticate };
