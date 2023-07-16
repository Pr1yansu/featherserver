const express = require("express");
const passport = require("passport");
const { isAuthenticated, isAdmin } = require("../Utils/auth");

const router = express.Router();

// Register Route
const {
  createUser,
  updateUser,
  forgotPassword,
  resetPassword,
  getAllUser,
  getSingleUser,
  getUserById,
  removeUserById,
} = require("../Controller/UserController");

router.post("/register", createUser);

// Login Route
router.post("/login", passport.authenticate("local"), (req, res) => {
  // If the authentication is successful, handle the response
  return res
    .status(200)
    .json({ message: "Logged in successfully", user: req.user });
});

// Google Authentication Route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google Authentication Callback Route
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: process.env.FRONTEND_URL,
  }),
  (req, res) => {
    // Redirect or handle the successful authentication response
    res.redirect(process.env.FRONTEND_URL);
  }
);

//user route
router.put("/update/user", isAuthenticated, updateUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/me", isAuthenticated, getSingleUser);

// admin Route
router.get("/admin/users", isAuthenticated, isAdmin, getAllUser);
router.get("/admin/user/profile/:id", isAuthenticated, isAdmin, getUserById);
router.delete(
  "/admin/user/profile/:id",
  isAuthenticated,
  isAdmin,
  removeUserById
);

module.exports = router;
