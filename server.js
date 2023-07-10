require("dotenv").config();
require("express-async-errors");
const cors = require("cors");
const compression = require("compression");
const cookieSession = require("cookie-session");
const passport = require("passport");
const passportSetup = require("./utils/passsport-setup");
const cookieParser = require("cookie-parser");
const mountRoutes = require("./routes");
const notFoundMiddleware = require("./middlewares/not-found");
const errorHandlerMiddleware = require("./middlewares/error-handler");

// express
const express = require("express");
const app = express();

// cors
app.use(cors());
app.options("*", cors());

// compress all responses
app.use(compression());

// cookieParser
app.use(cookieParser(process.env.cookieSecret));

// set up session cookies
app.use(
  cookieSession({
    name: "session",
    maxAge: 60 * 60 * 1000,
    keys: [process.env.cookieKey],
  })
);

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// database connection
const connectDB = require("./db/connect");

// middleware
app.use(express.json());

//  routers
mountRoutes(app);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 8000;

const start = async () => {
  try {
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
    connectDB(
      process.env.NODE_ENV === "development"
        ? process.env.MONGO_URI
        : process.env.MONGO_URI_PROD
    );
  } catch (error) {
    console.log(error);
  }
};

start();
