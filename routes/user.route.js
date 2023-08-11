const express = require("express");
const UserController = require("../controllers/user.controller");
const { asyncWrapper } = require("../utils/asyncWrapper");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();
router.get("/", authMiddleware(), asyncWrapper(UserController.getUsers));
router.get("/get-user/:uid", authMiddleware(), asyncWrapper(UserController.getUser));

router.get("/get-me", authMiddleware(), asyncWrapper(UserController.getMe));

router.post("/save-me", authMiddleware(), asyncWrapper(UserController.saveMe));

module.exports = router;
