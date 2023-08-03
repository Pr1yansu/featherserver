const express = require("express");
const {
  createMassage,
  getAllMassage,
  getSingleMassage,
} = require("../Controller/MassageController");
const { isAdmin, isAuthenticated } = require("../Utils/auth");

const router = express.Router();

router.post("/new/massage", createMassage);
router.get("/massages", isAuthenticated, isAdmin, getAllMassage);
router.post("/new/massage", isAuthenticated, isAdmin, getSingleMassage);

module.exports = router;
