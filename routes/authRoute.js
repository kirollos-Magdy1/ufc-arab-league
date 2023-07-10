const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  googleAuth,
  googleAuthRedirect,
  logout,
  login,
  register,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);

router.get("/google", googleAuth);

router.get(
  "/google/redirect",
  passport.authenticate("google"),
  googleAuthRedirect
);

router.get("/logout", logout);

module.exports = router;
