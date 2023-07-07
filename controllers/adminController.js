const User = require("../models/User");
const Event = require("../models/Event");
const { response } = require("express");
const axios = require("axios");
const parseDate = require("../utils/parse-date");
const { StatusCodes } = require("http-status-codes");
const Fight = require("../models/Fight");

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
  console.log(fights);

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

// @desc    get the upcoming event fights
// @route   GET /api/v1/admin/upcomingEvent
// @access  Protected/Admin

exports.getUpcomingEventEvent = async (req, res) => {
  const latestEvent = await Event.findOne().sort({ createdAt: -1 }).limit(1);
  const fights = await Fight.find({ eventId: latestEvent._id });
  res.status(StatusCodes.OK).json({ data: fights });
};

exports.calculateResults = async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: "results calculated" });
};
