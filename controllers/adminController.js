const User = require("../models/User");
const Event = require("../models/Event");
const { response } = require("express");
const axios = require("axios");
const parseDate = require("../utils/parse-date");
const { StatusCodes } = require("http-status-codes");
const Fight = require("../models/Fight");
const UserPredictions = require("../models/UserPredictions");
const Standings = require("../models/Standings");

// @desc    Add the upcoming event
// @route   POST /api/v1/admin/upcomingEvent
// @access  Protected/Admin

exports.createUpcomingEvent = async (req, res) => {
  const { date, title } = req.body;
  const options = {
    method: "GET",
    url: `${process.env.UFC_API_URL}/${date}`,
    headers: {
      "X-RapidAPI-Key": process.env.X_RapidAPI_Key,
      "X-RapidAPI-Host": process.env.X_RapidAPI_Host,
    },
  };

  const response = await axios.request(options);
  let fights = response.data;

  const event = await Event.create({
    title,
    eventDate: parseDate(date),
  });

  fights.forEach(async (fight) => {
    await Fight.create({
      eventId: event._id,
      fighters: [
        { name: fight.matchup[0], corner: "red" },
        { name: fight.matchup[1], corner: "blue" },
      ],
    });
  });
  res.status(StatusCodes.CREATED).json({ msg: "event and fights created" });
};

// @desc    update the user prediction by providing scores
// @route   PATCH /api/v1/admin/calcScore/:eventId
// @access  Protected/Admin

exports.calcScores = async (req, res) => {
  const { eventId } = req.params;
  const points = {
    "main-card": [10, 5],
    prelims: [7, 3],
    "early-prelims": [5, 2],
  };
  const fights = await Fight.find({ eventId });
  const userPredictions = await UserPredictions.find({
    eventId,
    score: { $eq: 0 },
  });

  userPredictions.forEach(async (userPrediction) => {
    userPrediction.predictions.forEach(async (prediction) => {
      const fight = fights.find((fight) => {
        return fight._id.toString() === prediction.fightId.toString();
      });
      if (
        prediction.winnerFighter === fight.results.winnerFighter &&
        prediction.winMethod === fight.results.winMethod
      ) {
        userPrediction.score +=
          (points[fight["tag"]][0] + points[fight["tag"]][1]) * 2;
      } else if (prediction.winnerFighter === fight.results.winnerFighter) {
        userPrediction.score += points[fight["tag"]][0];
      } else if (prediction.winMethod === fight.results.winMethod) {
        userPrediction.score += points[fight["tag"]][1];
      }
    });
    // console.log(userPrediction.score);
    await userPrediction.save();
  });
  res.status(StatusCodes.CREATED).json({ msg: "results calculated" });
};

// @desc    create standings based on user prediction score
// @route   POST /api/v1/admin/standings/:eventId
// @access  Protected/Admin

exports.createStandings = async (req, res) => {
  const { eventId } = req.params;
  const userPredictions = await UserPredictions.find({ eventId });
  userPredictions.sort((up1, up2) => up2.score - up1.score);
  console.log(userPredictions);
  let rank = 1;
  let prevScore = userPredictions[0].score;
  for (let i = 0; i < userPredictions.length; i++) {
    if (userPredictions[i].score < prevScore) {
      rank = i + 1;
      prevScore = userPredictions[i].score;
    }
    userPredictions[i].rank = rank;
    await userPredictions[i].save();
  }
  res.status(StatusCodes.CREATED).json({ msg: "standing created" });
};
