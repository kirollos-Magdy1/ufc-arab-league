const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "username is taken: choose another one"],
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
    },
    password: {
      type: String,
      // required: [true, "Please provide password"],
      // minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    overallScore: {
      type: Number,
      default: 0,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    profileImg: String,
    verified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
    },
    verificationCodeExpiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
