const authRoute = require("./authRoute");
const adminRoute = require("./adminRoute");
const userRoutes = require("./userRoute");

const mountRoutes = (app) => {
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/admin", adminRoute);
  app.use("/api/v1/user", userRoutes);
};

module.exports = mountRoutes;
