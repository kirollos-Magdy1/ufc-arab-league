const http = require("http");
const https = require("https");
require("dotenv").config();
require("express-async-errors");
const cors = require("cors");
const compression = require("compression");
const cookieSession = require("cookie-session");
const passport = require("passport");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss");

const passportSetup = require("./utils/passsport-setup");
const cookieParser = require("cookie-parser");
const mountRoutes = require("./routes");
const notFoundMiddleware = require("./middlewares/not-found");
const errorHandlerMiddleware = require("./middlewares/error-handler");

const rateLimit = require("express-rate-limit");

// express
const express = require("express");
const app = express();

// cors
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

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
app.use(express.json({ limit: "20kb" }));

/*

// request rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
// Apply the rate limiting middleware to all requests
app.use(limiter);
*/

// prevent HTTP Parameter Pollution
app.use(hpp());

// To remove data using these defaults:
app.use(mongoSanitize());

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
