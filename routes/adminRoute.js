const express = require("express");
const router = express.Router();

const {
  createUpcomingEvent,
  createStandings,
  calcScores,
} = require("../controllers/adminController");
const { authenticate } = require("../middlewares/authentication");
const { authorize } = require("../middlewares/authorization");

router.use(authenticate, authorize("admin"));

router.route("/upcomingEvent").post(createUpcomingEvent);

router.patch("/calcScore/:eventId", calcScores);

router.post("/standings/:eventId", createStandings);

module.exports = router;
