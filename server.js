const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./Config/.env" });
const app = require("./app");

const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
const port = process.env.PORT || 4000;
app.use(express.json());
// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

app.listen(port, (req, res) => {
  console.log(`Server is running on port: ${port} in ${process.env.NODE_ENV} `);
});
