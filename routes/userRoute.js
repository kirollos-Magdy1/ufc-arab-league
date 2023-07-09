const express = require("express");
const router = express.Router();

const {
  createPredictions,
  getStandings,
  getUpcomingEventEvent,
  getProfile,
  editPredictions,
} = require("../controllers/userControllers");
const { authenticate } = require("../middlewares/authentication");

router.get("/standings/:eventId", getStandings);
router.get("/", getUpcomingEventEvent);

router.use(authenticate);

router.post("/predictions/:eventId", createPredictions);
router.post("/predictions/:eventId", editPredictions);
router.route("/profile").get(getProfile);

module.exports = router;
