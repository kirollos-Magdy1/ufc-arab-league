const crypto = require("crypto");
const { StatusCodes } = require("http-status-codes");
const passport = require("passport");
const { attachCookiesToResponse } = require("../utils/jwt");
const sendVerificationEmail = require("../utils/sendVerficationEmail");
const User = require("../models/User");
const CustomError = require("../errors");
// send google consent  screen

exports.googleAuth = passport.authenticate("google", { scope: ["profile"] });

exports.googleAuthRedirect = async (req, res) => {
  res.redirect("../../user");
};
/*
exports.logout = async (req, res) => {
  req.logout();
  res.status(StatusCodes.OK).send({ msg: "user logged out" });
};
*/

exports.register = async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email });

  if (userExists)
    throw new CustomError.BadRequestError("user email already exists");

  const user = await User.create(req.body);
  const tokenUser = {
    name: user.name,
    id: user._id,
    role: user.role,
  };
  const token = attachCookiesToResponse({ res, user: tokenUser });

  // res.status(StatusCodes.CREATED).json({ user: tokenUser });
  res.status(StatusCodes.CREATED).json({ token });
};

exports.login = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  const tokenUser = {
    name: user.name,
    id: user._id,
    role: user.role,
  };
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

exports.registerOTP = async (req, res) => {
  console.log(req.body);
  const { email, name } = req.body;
  const user = await User.findOne({ email });
  if (user) throw new CustomError.BadRequestError("user email already exists");

  const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const hashedVerificationCode = crypto
    .createHash("sha256")
    .update(verificationCode)
    .digest("hex");

  const fiveMins = 5 * 60 * 1000;

  await User.create({
    email,
    name,
    verificationCode: hashedVerificationCode,
    verificationCodeExpiresAt: Date.now() + fiveMins,
    verified: false,
  });

  await sendVerificationEmail({
    name,
    email,
    verificationCode,
  });

  res.status(StatusCodes.OK).json({
    msg: `verification code sent to the email ${email} head to your inbox to verify https://mail.google.com`,
  });
};

exports.loginOTP = async (req, res) => {
  const { email, name } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new CustomError.BadRequestError("user email not exist");
  if (user.verified)
    throw new CustomError.BadRequestError("user email already verified");

  const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const hashedVerificationCode = crypto
    .createHash("sha256")
    .update(verificationCode)
    .digest("hex");

  const fiveMins = 5 * 60 * 1000;
  user.verificationCode = hashedVerificationCode;
  user.verificationCodeExpiresAt = Date.now() + fiveMins;

  await sendVerificationEmail({
    name,
    email,
    verificationCode,
  });

  res.status(StatusCodes.OK).json({
    msg: `verification code sent to the email ${email} head to your inbox to verify https://mail.google.com`,
  });
};

exports.verifyUser = async (req, res) => {
  const { verificationCode } = req.body;

  const hashedVerificationCode = crypto
    .createHash("sha256")
    .update(verificationCode)
    .digest("hex");

  const user = await User.findOne({
    verificationCode: hashedVerificationCode,
    verificationCodeExpiresAt: { $gt: Date.now() },
  });
  if (!user)
    throw new CustomError.BadRequestError(
      `Verification code is invalid or expired`
    );

  if (user.verified)
    throw new CustomError.BadRequestError(`User already verified`);

  user.verified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpiresAt = undefined;

  await user.save();

  const tokenUser = {
    name: user.name,
    id: user._id,
    role: user.role,
  };
  //res.redirect("../../../user");
  const token = attachCookiesToResponse({ res, user: tokenUser });

  // res.status(StatusCodes.CREATED).json({ user: tokenUser });
  res.status(StatusCodes.CREATED).json({ token });
};

exports.logout = (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};
