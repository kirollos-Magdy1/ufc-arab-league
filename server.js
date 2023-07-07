require("dotenv").config();
require("express-async-errors");
const cors = require("cors");
const compression = require("compression");

const mountRoutes = require("./routes");
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middlewares/error-handler");

// express
const express = require("express");
const app = express();

// cors
app.use(cors());
app.options("*", cors());

// compress all responses
app.use(compression());

const cookieParser = require("cookie-parser");

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
    await connectDB(process.env.MONGO_URL);
  } catch (error) {
    console.log(error);
  }
};

start();
