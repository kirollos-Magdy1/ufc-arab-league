const mongoose = require("mongoose");

const StangingsSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.ObjectId,
      ref: "Event",
    },
    users: [
      {
        userid: mongoose.Schema.ObjectId,
        score: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stangings", StangingsSchema);
