const mongoose = require("mongoose");
const asyncError = require("../Utils/asyncError");

const connectDB = asyncError(async () => {
  mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Database Connected Successfully");
  });
});

module.exports = connectDB;
