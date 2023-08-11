const express = require("express");
const userRoutes = require("./user.route");
const orderRoutes = require("./order.route");
const addressvnRoutes = require("./addressvn.route");
const appRoutes = require("./app.route");

const apiRoutes = express.Router();
apiRoutes.use("/api/users", userRoutes);
apiRoutes.use("/api/orders", orderRoutes);
apiRoutes.use("/api/addressvn", addressvnRoutes);
apiRoutes.use("/api/app", appRoutes);

apiRoutes.get("/", (req, res) => res.json({ api: "is-working" }));
module.exports = apiRoutes;
