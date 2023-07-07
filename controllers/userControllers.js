const User = require("../models/User");
const Event = require("../models/Event");
const { response } = require("express");
const axios = require("axios");
const parseDate = require("../utils/parse-date");
const { StatusCodes } = require("http-status-codes");
const Fight = require("../models/Fight");
const UserPrediction = require("../models/UserPredictions");

exports.createPredictions = async (req, res) => {
  const { eventId } = req.params;
  const { userId } = req.body;
  req.body.eventId = eventId;
  const userPrediction = await UserPrediction.create(req.body);
  res.send("created");
  console.log(userPrediction);
};

exports.updatePredictions = async (req, res) => {
  const { eventId } = req.params;
  console.log(eventId);
};

exports.getStandings = async (req, res) => {};

exports.updateProfile = async (req, res) => {};

exports.getProfile = async (req, res) => {};
