const express = require("express");
const router = express.Router();
const { isAuthenticated, isAdmin } = require("../Utils/auth");
const {
  createPhoto,
  getPhotos,
  getPhoto,
  updatePhoto,
  deletePhoto,
  getPhotosAll,
  createReview,
} = require("../Controller/PhotoController");

// Create a new photo
router.post("/new/photo", isAuthenticated, isAdmin, createPhoto);

// get all photo
router.get("/photos/all", getPhotosAll);

//get all photos by page
router.get("/photos", getPhotos);

// Get a specific photo
router.get("/photo/:id", getPhoto);

// Update a photo
router.put("photo/:id", isAdmin, updatePhoto);

// Delete a photo
router.delete("photo/:id", isAdmin, deletePhoto);

//Review a photo
router.put("/photo/review", isAuthenticated, createReview);

module.exports = router;
