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
    score: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserPredictionSchema);
