const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  googleAuth,
  googleAuthRedirect,
  logout,
} = require("../controllers/authController");

router.get("/google", googleAuth);

router.get(
  "/google/redirect",
  passport.authenticate("google"),
  googleAuthRedirect
);

router.get("/logout", logout);

module.exports = router;
