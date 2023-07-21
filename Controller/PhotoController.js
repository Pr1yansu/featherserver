const Photo = require("../Models/Photo");
const Category = require("../Models/Category");
const asyncError = require("../Utils/asyncError");
const { ErrorHandler } = require("../Utils/errohandler");
const ApiFeatures = require("../Utils/filter");
const cloudinary = require("cloudinary").v2;

exports.createPhoto = asyncError(async (req, res, next) => {
  const { title, description, categoryName, comment, like, price } = req.body;

  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imageLink = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.uploader.upload(images[i], {
      folder: "photos",
    });

    imageLink.push({
      publicId: result.public_id,
      url: result.secure_url,
    });
  }

  const User = req.user;
  const userName = User.name; // Assuming you have the user ID available in the session

  // Find the category based on the provided category name
  const category = await Category.findOne({ categoryName });

  if (!category) {
    return res.status(400).json({ message: "Invalid category" });
  }

  // Create the photo record
  const photo = await Photo.create({
    title,
    description,
    images: [imageLink],
    user: userName, // Associate the photo with the user
    category: category.name, // Set the category reference
    price,
    reviews: [
      {
        user: userName,
        comment,
        like,
      },
    ],
  });

  res.status(201).json({
    success: true,
    message: "Photo created successfully",
    photo,
  });
});

exports.getPhotos = asyncError(async (req, res, next) => {
  const resultPerPage = 8;
  const photoCount = await Photo.countDocuments();
  const apiFeature = new ApiFeatures(Photo.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

  const photos = await apiFeature.query;
  if (!photos) {
    next(new ErrorHandler(404, "Photo not found"));
  }
  res.status(200).json({
    success: true,
    photoCount: photoCount,
    photos,
  });
});

exports.getPhotosAll = asyncError(async (req, res, next) => {
  const resultPerPage = 12;
  const photoCount = await Photo.countDocuments();
  const apiFeature = new ApiFeatures(Photo.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

  const photos = await apiFeature.query;
  if (!photos) {
    next(new ErrorHandler(404, "Photo not found"));
  }
  res.status(200).json({
    success: true,
    photoCount: photoCount,
    photos,
    resultPerPage,
  });
});

exports.getPhoto = asyncError(async (req, res, next) => {
  const photo = await Photo.findById(req.params.id);
  if (!photo) {
    next(new ErrorHandler(404, "Photo not found"));
  }
  res.status(200).json({
    success: true,
    photo,
  });
});

exports.updatePhoto = asyncError(async (req, res, next) => {
  const photo = await Photo.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!photo) {
    next(new ErrorHandler(404, "Photo not found"));
  }
  res.status(200).json({
    success: true,
    photo,
  });
});

exports.deletePhoto = asyncError(async (req, res, next) => {
  const photo = await Photo.findByIdAndDelete(req.params.id);
  if (!photo) {
    next(new ErrorHandler(404, "Photo not found"));
  }
  res.status(200).json({
    success: true,
    message: "Photo deleted successfully",
  });
});

exports.createReview = asyncError(async (req, res, next) => {
  const { like, comment, productId } = req.body;
  const review = {
    user: req.user.name,
    like: Number(like),
    comment,
  };

  const photo = await Photo.findById(productId);

  const isReviewed = photo.reviews.find((rev) => rev.user === req.user.name);

  if (isReviewed) {
    photo.reviews.forEach((rev) => {
      if (rev.user === req.user.name) {
        rev.comment = comment;
        rev.like = like;
      }
    });
  } else {
    photo.reviews.push(review);
    photo.numberOfReviews = photo.reviews.length;
  }
  let avg = 0;
  photo.rating =
    photo.reviews.forEach((rev) => {
      avg += rev.like;
    }) / photo.reviews.length;

  await photo.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});
