const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide name"],
      minlength: 3,
      maxlength: 50,
    },
    googleId: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please provide email"],
      validate: {
        validator: validator.isEmail,
        message: "Please provide valid email",
      },
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    overallScore: {
      type: Number,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    profileImg: String,
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
