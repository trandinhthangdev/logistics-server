const express = require("express");
const orderRoutes = require("./order.route");
const addressvnRoutes = require("./addressvn.route");

const apiRoutes = express.Router();
apiRoutes.use("/api/orders", orderRoutes);
apiRoutes.use("/api/addressvn", addressvnRoutes);
apiRoutes.get("/", (req, res) => res.json({ api: "is-working" }));
module.exports = apiRoutes;
