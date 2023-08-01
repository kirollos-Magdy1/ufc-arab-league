const mongoose = require("mongoose");

const UserPredictionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    eventId: {
      type: mongoose.Schema.ObjectId,
      ref: "Event",
    },
    predictions: [
      {
        fightId: mongoose.Schema.ObjectId,
        winnerFighter: {
          type: String,
          enum: ["red", "blue"],
          required: true,
        },
        winMethod: {
          type: String,
          enum: ["KO/TKO", "Submission", "Decision"],
          required: true,
        },
          winTime: {
          type: String,
          enum: ["over", "under"],
          required: true,
        }
      },
    ],
    score: {
      type: Number,
      default: 0,
    },
    rank: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserPrediction", UserPredictionSchema);
