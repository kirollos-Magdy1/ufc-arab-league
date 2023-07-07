const authRoute = require("./authRoute");
const adminRoute = require("./adminRoute");

const mountRoutes = (app) => {
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/admin", adminRoute);
};

module.exports = mountRoutes;
