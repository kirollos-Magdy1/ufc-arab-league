const express = require("express");
const router = express.Router();
const passport = require("passport");
const https = require("https");

const {
  logout,
  login,
  register,
  registerOTP,
  loginOTP,
  verifyUser,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);

router.route("/otp/register").post(registerOTP);
router.route("/otp/login").post(loginOTP);

router.route("/otp/verify").post(verifyUser);

router.get("/logout", logout);

module.exports = router;
