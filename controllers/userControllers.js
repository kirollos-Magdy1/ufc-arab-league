const User = require("../models/User");
const Event = require("../models/Event");
const { response } = require("express");
const axios = require("axios");
const parseDate = require("../utils/parse-date");
const { StatusCodes } = require("http-status-codes");
const Fight = require("../models/Fight");
const UserPrediction = require("../models/UserPredictions");

// @desc    make fights predictions for a given event.
// @route   POST /api/v1/user/predictions
// @access  Private/user

exports.createPredictions = async (req, res) => {
  const { eventId } = req.params;
  const { userId } = req.body;
  req.body.eventId = eventId;
  const userPrediction = await UserPrediction.create(req.body);
  res.send("created");
  console.log(userPrediction);
};

exports.updatePredictions = async (req, res) => {};

// @desc    get the upcoming event fights
// @route   GET /api/v1/user/upcomingEvent
// @access  Public

exports.getUpcomingEventEvent = async (req, res) => {
  const latestEvent = await Event.findOne().sort({ createdAt: -1 }).limit(1);
  const fights = await Fight.find({ eventId: latestEvent._id });
  res.status(StatusCodes.OK).json({ data: fights });
};

// @desc    get event standings
// @route   GET /api/v1/user/standings/:eventId
// @access  Public

exports.getStandings = async (req, res) => {
  const { eventId } = req.params.eventId;

  const rankedUserPredictions = await UserPrediction.find(eventId)
    .sort({
      score: -1,
    })
    .select("rank score")
    .populate({
      path: "userId",
      select: "name -_id",
    });

  res.status(StatusCodes.OK).json({ data: rankedUserPredictions });
};

exports.updateProfile = async (req, res) => {};

exports.getProfile = async (req, res) => {};
