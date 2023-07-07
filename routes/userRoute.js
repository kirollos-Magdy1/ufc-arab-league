const express = require("express");
const router = express.Router();

const {
  createPredictions,
  getStandings,
} = require("../controllers/userControllers");

router.get("/standings", getStandings);

router.post("/predictions/:eventId", createPredictions);

module.exports = router;
