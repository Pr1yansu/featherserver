const express = require("express");
const {
  createMassage,
  getAllMassage,
  getSingleMassage,
} = require("../Controller/MassageController");
const { isAdmin } = require("../Utils/auth");

const router = express.Router();

router.post("/new/massage", createMassage);
router.get("/massages", isAdmin, getAllMassage);
router.post("/new/massage", isAdmin, getSingleMassage);

module.exports = router;
