const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const FightSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.ObjectId,
      ref: "Event",
    },
    users: [
      {
        userId: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        },
        fightWinnerChoice: {},
        fightWinMethodChoice: {},
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Fight", FightSchema);
