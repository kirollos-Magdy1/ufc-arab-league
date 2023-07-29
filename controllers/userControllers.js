const User = require("../models/User");
const Event = require("../models/Event");
const { response } = require("express");
const axios = require("axios");
const parseDate = require("../utils/parse-date");
const { StatusCodes } = require("http-status-codes");
const Fight = require("../models/Fight");
const UserPrediction = require("../models/UserPredictions");
const { sensitizeUser } = require("../utils/sensitizeData");
const CustomError = require("../errors");

// @desc    get the upcoming event fights
// @route   GET /api/v1/user/upcomingEvent
// @access  Public

exports.getUpcomingEventEvent = async (req, res) => {
  // console.log(req.user._id.toString());
  // console.log(req.headers.cookie);
  const latestEvent = await Event.findOne().sort({ createdAt: -1 }).limit(1);
  console.log(await Event.findOne());

  const fights = await Fight.find({ eventId: latestEvent._id }).select(
    "-results -order"
  );
  res.status(StatusCodes.OK).json({
    data: {
      eventTitle: latestEvent.title,
      eventDate: latestEvent.eventDate,
      fights,
    },
  });
};

exports.submitPredictions = async (req, res) => {
  const latestEvent = await Event.findOne().sort({ createdAt: -1 }).limit(1);
  if (!latestEvent.open)
    throw new CustomError.BadRequestError("Predictions closed for this event");

  req.body = { ...req.body, eventId: latestEvent._id, userId: req.user.id };

  const userPrediction = await UserPrediction.findOneAndUpdate(
    { userId: req.user.id },
    req.body
  );
  if (!userPrediction) await UserPrediction.create(req.body);
  const user = req.user;
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "successfully submitted", data: user });
};
/*
// @desc    make fights predictions for a given event.
// @route   POST /api/v1/user/predictions
// @access  Private/user

exports.createPredictions = async (req, res) => {
  // const { eventId } = req.params;
  const latestEvent = await Event.findOne().sort({ createdAt: -1 }).limit(1);

  req.body = { ...req.body, eventId: latestEvent._id, userId: req.user.id };
  const userPrediction = await UserPrediction.create(req.body);
  res.status(StatusCodes.CREATED).json({ data: userPrediction });
};

// @desc    edit fights predictions for a given event.
// @route   PATCH /api/v1/user/predictions
// @access  Private/user
exports.editPredictions = async (req, res) => {
  const { userPredictionId } = req.params;
  const userId = req.user.id;
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
*/

exports.getMyPredictions = async (req, res) => {
  const latestEvent = await Event.findOne().sort({ createdAt: -1 }).limit(1);
  console.log(req.user.id);
  const myPredictions = await UserPrediction.findOne({
    userId: req.user.id,
    eventId: latestEvent._id,
  })
    .populate("eventId")
    .populate({
      path: "predictions.fightId",
      model: "Fight",
      select: "-results",
    });

  if (!myPredictions)
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ msg: "you did not submit predictions" });

  res.status(StatusCodes.OK).json({ data: myPredictions });
};

exports.getOthersPredictions = async (req, res) => {
  const { userPredictionsId } = req.params;
  const uesrPredictions = await UserPrediction.findById(userPredictionsId)
    .populate("eventId")
    .populate({
      path: "predictions.fightId",
      model: "Fight",
      select: "-results",
    });

  res.status(StatusCodes.OK).json({ data: uesrPredictions });
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

exports.getMyRank = async (req, res) => {};

exports.getProfile = async (req, res) => {
  console.log("inside prfile");
  const user = req.user;
  console.log(req.user);
  //  const user = await User.findById(req.user.id);
  res.status(StatusCodes.OK).send({ data: user });
};

exports.updateProfile = async (req, res) => {
  const { newName } = req.body;
  const user = await User.find({ name: newName });
  if (user)
    throw new CustomError.BadRequestError(
      `username already exists, try another one `
    );

  await user.findOneAndUpdate(
    { _id: req.body.id },
    { name: newName },
    {
      runValidators: true,
    }
  );
  res.status(StatusCodes.OK).json({ msg: "username updated" });
};
