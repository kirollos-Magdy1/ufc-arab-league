const express = require("express");
const router = express.Router();

const {
  createUpcomingEvent,
  getUpcomingEventEvent,
} = require("../controllers/adminController");

router
  .route("/upcomingEvent")
  .post(createUpcomingEvent)
  .get(getUpcomingEventEvent);

module.exports = router;
