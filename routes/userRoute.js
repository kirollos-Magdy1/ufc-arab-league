const express = require("express");
const router = express.Router();

const {
  createPredictions,
  getStandings,
  getUpcomingEventEvent,
} = require("../controllers/userControllers");

router.get("/", getUpcomingEventEvent);

router.get("/standings/:eventId", getStandings);

router.post("/predictions/:eventId", createPredictions);

module.exports = router;
