const { UnauthenticatedError, BadRequestError } = require("../errors");
const { isTokenValid } = require("../utils/jwt");

const authenticate = async (req, res, next) => {
  const token = req.cookies.token;
  console.log(token);

  if (!token) {
    throw new BadRequestError("no token: authentication Invalid");
  }
  try {
    const { name, id, role } = isTokenValid({ token });

    req.user = { name, id, role };
    console.log(req.user);
    next();
  } catch (error) {
    console.log(error);
    throw new UnauthenticatedError("authentication Invalid");
  }
};

module.exports = { authenticate };
