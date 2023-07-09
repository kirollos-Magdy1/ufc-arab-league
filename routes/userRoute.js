const express = require("express");
const router = express.Router();

const {
  createPredictions,
  getStandings,
  getUpcomingEventEvent,
  getProfile,
} = require("../controllers/userControllers");
const { authenticate } = require("../middlewares/authentication");

router.get("/", getUpcomingEventEvent);

router.get("/standings/:eventId", getStandings);

router.post("/predictions/:eventId", createPredictions);

router.route("/profile").get(authenticate, getProfile);

module.exports = router;
