const express = require("express");
const router = express.Router();

const {
  createUpcomingEvent,
  calcScores,
} = require("../controllers/adminController");

router.route("/upcomingEvent").post(createUpcomingEvent);

router.post("/calcScore/:eventId", calcScores);

module.exports = router;
