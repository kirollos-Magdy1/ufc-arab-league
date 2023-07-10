const { StatusCodes } = require("http-status-codes");
const passport = require("passport");
const { attachCookiesToResponse } = require("../utils/jwt");

const User = require("../models/User");
// send google consent  screen
exports.googleAuth = passport.authenticate("google", { scope: ["profile"] });

exports.googleAuthRedirect = async (req, res) => {
  res.redirect("../../user");
};

exports.logout = async (req, res) => {
  req.logout();
  res.status(StatusCodes.OK).send({ msg: "user logged out" });
};

exports.register = async (req, res) => {
  const user = await User.create(req.body);
  const tokenUser = {
    name: user.name,
    id: user._id,
    role: user.role,
  };
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

exports.login = async (req, res) => {
  const user = await User.findOne({ email });

  const tokenUser = {
    name: user.name,
    id: user._id,
    role: user.role,
  };
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};
