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
  req.body = { ...req.body, eventId, userId: req.user._id };
  const userPrediction = await UserPrediction.create(req.body);
  res.status(StatusCodes.CREATED).json({ data: userPrediction });
};

// @desc    edit fights predictions for a given event.
// @route   PATCH /api/v1/user/predictions
// @access  Private/user
exports.editPredictions = async (req, res) => {
  const { userPredictionId } = req.params;
  const userId = req.user._id;
  const userPrediction = await UserPrediction.findOneAndUpdate(
    { _id: userPredictionId, userId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(StatusCodes.OK).json({ data: userPrediction });
};

// @desc    get the upcoming event fights
// @route   GET /api/v1/user/upcomingEvent
// @access  Public

exports.getUpcomingEventEvent = async (req, res) => {
  // console.log(req.user._id.toString());
  console.log(req.headers.cookie);
  console.log(req.user);
  const latestEvent = await Event.findOne().sort({ createdAt: -1 }).limit(1);
  const fights = await Fight.find({ eventId: latestEvent._id });
  res.status(StatusCodes.OK).json({
    data: {
      eventTitle: latestEvent.title,
      eventDate: latestEvent.eventDate,
      fights,
    },
  });
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

exports.getProfile = async (req, res) => {
  res.status(StatusCodes.OK).send(req.user);
};

exports.updateProfile = async (req, res) => {};
