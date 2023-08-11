const express = require("express");
const AppController = require("../controllers/app.controller");
const { asyncWrapper } = require("../utils/asyncWrapper");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();
router.get("/statis", authMiddleware(), asyncWrapper(AppController.getStatis));



module.exports = router;
