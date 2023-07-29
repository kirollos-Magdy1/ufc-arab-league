const { number } = require("joi");
const mongoose = require("mongoose");

const FightSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.ObjectId,
      ref: "Event",
    },
    tag: {
      type: String,
      enum: ["main-card", "prelims", "early-prelims"],
      default: "main-card",
    },
    fighters: [
      {
        name: String,
        age: Number,
        height: String,
        reach: String,
        corner: {
          type: String,
          enum: ["red", "blue"],
        },
      },
    ],
    results: {
      winnerFighter: {
        type: String,
        enum: ["red", "blue", "pending"],
        default: "pending",
      },
      winMethod: {
        type: String,
        enum: ["KO/TKO", "Submission", "Decision", "pending"],
        default: "pending",
      },
      winTime: {
      type: String,
      enum: ["over", "under","pending"],
      default: "pending",
      }
    },
    order: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Fight", FightSchema);
