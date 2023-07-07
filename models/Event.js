const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide title"],
      minlength: 3,
      maxlength: 50,
    },
    eventDate: {
      type: Date,
    },
    closeTime: {
      type: Date,
    },
    subscribers: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema);
