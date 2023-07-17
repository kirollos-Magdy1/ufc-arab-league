const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const { attachCookiesToResponse } = require("../utils/jwt");

passport.serializeUser((user, done) => {
  console.log("inside serialize");

  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log("inside deserialize");

  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      // options for google strategy
      clientID: process.env.google_clientID,
      clientSecret: process.env.google_clientSecret,
      callbackURL: process.env.google_callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("callback fired");

      // check if user already exists in our own db

      const user = await User.findOne({ googleId: profile.id });
      if (user) {
        console.log("user is: ", user);
        done(null, user);
      } else {
        // if not, create user in our db
        const user = await User.create({
          googleId: profile.id,
          name:
            profile.displayName +
            Math.floor(1000 + Math.random() * 9000).toString(),
        });

        console.log("created new user: ", user);
        done(null, user);
      }
    }
  )
);
