const express = require("express");
const { asyncWrapper } = require("../utils/asyncWrapper");
const authMiddleware = require("../middlewares/auth.middleware");
const AddressVnController = require("../controllers/addressvn.controller");

const router = express.Router();

// Get all provinces
router.get("/provinces", asyncWrapper(AddressVnController.getAllProvinces));
router.get(
    "/districts/:idProvince",
    asyncWrapper(AddressVnController.getAllDistrict)
);
router.get(
    "/district/:idDistrict",
    asyncWrapper(AddressVnController.getDetailDistrict)
);

// Add other routes for updating and deleting orders

module.exports = router;
