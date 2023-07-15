const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  googleAuth,
  googleAuthRedirect,
  logout,
  login,
  register,
  registerOTP,
  loginOTP,
  verifyUser,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);

router.get("/google", googleAuth);

router.get(
  "/google/redirect",
  passport.authenticate("google"),
  googleAuthRedirect
);

router.route("/otp/register").post(registerOTP);
router.route("/otp/login").post(loginOTP);

router.route("/otp/verify").post(verifyUser);

router.post("/logout", logout);

module.exports = router;
