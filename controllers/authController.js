const { isTokenValid } = require("../utils/jwt");
const crypto = require("crypto");
const { StatusCodes } = require("http-status-codes");
const passport = require("passport");
const { createJWT } = require("../utils/jwt");
const sendVerificationEmail = require("../utils/sendVerficationEmail");
const User = require("../models/User");
const CustomError = require("../errors");
const { sensitizeUser } = require("../utils/sensitizeData");

exports.registerOTP = async (req, res) => {
  console.log(req.body);
  const { email, name } = req.body;
  const user = await User.findOne({ email });

  if (user) throw new CustomError.BadRequestError("user email already exists");

  if (email.split("@")[1] !== "gmail.com")
    throw new CustomError.BadRequestError("please enter a valid gmail");

  const lowercaseName = name.toLowerCase();

  if (await User.findOne({ name: lowercaseName }))
    throw new CustomError.BadRequestError(
      "username is taken: choose another one"
    );

  await User.create({
    email,
    name: lowercaseName,
  });

  // await sendVerificationEmail({
  //   name,
  //   email,
  //   verificationCode,
  // });

  res.status(StatusCodes.OK).json({
    msg: `verification code sent to the email ${email} head to your inbox to verify https://mail.google.com`,
  });
};

exports.loginOTP = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new CustomError.BadRequestError("user email not exist");

  const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const hashedVerificationCode = crypto
    .createHash("sha256")
    .update(verificationCode)
    .digest("hex");

  const fiveMins = 5 * 60 * 1000;
  user.verificationCode = hashedVerificationCode;
  user.verificationCodeExpiresAt = Date.now() + fiveMins;

  await user.save();
  console.log(user);

  await sendVerificationEmail({
    name: user.name,
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
  console.log(user);
  if (!user)
    throw new CustomError.BadRequestError(
      `Verification code is invalid or expired`
    );

  user.verified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpiresAt = undefined;

  await user.save();

  const tokenUser = {
    name: user.name,
    id: user._id,
    role: user.role,
    overallScore: user.overallScore,
  };

  const token = createJWT(tokenUser);

  const cookieLifetime = parseInt(process.env.COOKIE_LIFETIME);
  const expirationDate = new Date(Date.now() + cookieLifetime);

  res.cookie("token", token, {
    httpOnly: false,
    withCredentials: true,
    expires: expirationDate,
    sameSite: "None",
    secure: process.env.NODE_ENV === "production",
  });
  // res.status(StatusCodes.CREATED).json({ user: tokenUser });
  res.status(StatusCodes.CREATED).json({
    message: "Account verified successfully",
    success: true,
    user: sensitizeUser(user),
    token,
  });
};

// FOR TESTING

exports.logout = (req, res) => {
  res.cookie("token", "logout", {
    withCredentials: true,
    httpOnly: false,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};

exports.register = async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email });

  if (userExists)
    throw new CustomError.BadRequestError("user email already exists");

  const user = await User.create(req.body);

  const tokenUser = {
    name: user.name,
    id: user._id,
    role: user.role,
    overallScore: user.overallScore,
  };

  const token = createJWT(tokenUser);
  console.log("token");
  console.log(token);
  const tenDays = 1000 * 60 * 60 * 24 * 10;

  res.cookie("token", token, {
    httpOnly: false,
    withCredentials: true,
    expires: new Date(Date.now()),
    secure: process.env.NODE_ENV === "production",
  });
  // res.status(StatusCodes.CREATED).json({ user: tokenUser });
  res.status(StatusCodes.CREATED).json({
    message: "User User registered please verify your account",
    success: true,
    user: sensitizeUser(user),
  });
};

exports.login = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  const tokenUser = {
    name: user.name,
    id: user._id,
    role: user.role,
    overallScore: user.overallScore,
  };

  const token = createJWT(tokenUser);
  res.cookie("token", token, {
    httpOnly: false,
    withCredentials: true,
    expires: new Date(Date.now() + parseInt(process.env.COOKIE_LIFETIME)),
    secure: process.env.NODE_ENV === "production",
  });

  res
    .status(StatusCodes.CREATED)
    .json({ msg: "User signed in please verify your account", success: true });
};
