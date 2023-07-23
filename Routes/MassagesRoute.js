const express = require("express");
const {
  createMassage,
  getAllMassage,
  getSingleMassage,
} = require("../Controller/massageController");

const router = express.Router();

router.post("/new/massage", createMassage);
router.get("/massages", getAllMassage);
router.post("/new/massage", getSingleMassage);

module.exports = router;
