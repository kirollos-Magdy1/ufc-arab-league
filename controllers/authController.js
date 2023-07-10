const { StatusCodes } = require("http-status-codes");
const passport = require("passport");

// send google consent  screen
exports.googleAuth = passport.authenticate("google", { scope: ["profile"] });

exports.googleAuthRedirect = async (req, res) => {
  res.redirect(`${req.host}/api/v1/users`);
};

exports.logout = async (req, res) => {
  req.logout();
  res.status(StatusCodes.OK).send({ msg: "user logged out" });
};
