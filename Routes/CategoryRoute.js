const express = require("express");
const {
  createCategory,
  getAllCategories,
  deleteCategory,
} = require("../Controller/CategoryController");
const { isAuthenticated, isAdmin } = require("../Utils/auth");

const router = express.Router();

// Create a new category
router.post("/category", isAuthenticated, isAdmin, createCategory);
router.post("/category", isAuthenticated, isAdmin, deleteCategory);

router.get("/category", getAllCategories);

module.exports = router;
