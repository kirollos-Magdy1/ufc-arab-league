const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide title"],
      minlength: 3,
      maxlength: 50,
    },
    closeTime: {
      type: Date,
    },
    subscribers: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema);
