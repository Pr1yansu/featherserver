const User = require("../Models/User");
const bcrypt = require("bcrypt");
const asyncError = require("../Utils/asyncError");
const { ErrorHandler } = require("../Utils/errohandler");
const Crypto = require("crypto");
const sendEmail = require("../Utils/sendEmail");
const cloudinary = require("cloudinary");

// Create User
exports.createUser = asyncError(async (req, res, next) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });

  const { name, email, password } = req.body;
  console.log(name, email, password);
  let user = await User.findOne({ email });

  if (user) {
    return next(new ErrorHandler(400, "User already exists"));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user = await User.create({
    name,
    email,
    password: hashedPassword,
    avatar: {
      publicId: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  res.status(201).json({
    success: true,
    message: "User created successfully",
    user,
  });
});

//Get All Users
exports.getAllUser = asyncError(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    users,
  });
});
//Get single user
exports.getSingleUser = asyncError(async (req, res, next) => {
  const email = req.user.email;

  const user = await User.findOne({ email });

  res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    user,
  });
});
//Get single User By Id
exports.getUserById = asyncError(async (req, res, next) => {
  const id = req.params.id;

  const user = await User.findById({ id });

  res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    user,
  });
});
//Get single User By Id
exports.removeUserById = asyncError(async (req, res, next) => {
  const id = req.params.id;

  const user = await User.findByIdAndDelete({ id });

  res.status(200).json({
    success: true,
    message: "Users deleted successfully",
    user,
  });
});

// Update User
exports.updateUser = asyncError(async (req, res, next) => {
  const { name, email } = req.body;
  const { _id } = req.user;

  const user = await User.findByIdAndUpdate(
    _id,
    { name, email },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    user,
  });
});

// Generate and store reset password token
exports.forgotPassword = asyncError(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler(404, "User not found"));
  }

  const resetToken = Crypto.randomBytes(20).toString("hex");
  const resetPasswordToken = Crypto.createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = resetPasswordToken;
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes
  await user.save();

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/reset-password/${resetPasswordToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of the password for your account.\n\nPlease click on the following link to complete the process:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.`;

  await sendEmail({
    email: user.email,
    subject: "Password Reset",
    message,
  });

  res.status(200).json({ success: true, message: "Email sent" });
});

// Reset password using temporary token
exports.resetPassword = asyncError(async (req, res, next) => {
  const { token } = req.params;
  console.log(token);
  const { password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user || user.resetPasswordToken !== token) {
    return next(new ErrorHandler(400, "Invalid token"));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Update the password
  user.password = hashedPassword;

  // Clear the temporary token and expiration
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successful",
    user,
  });
});
