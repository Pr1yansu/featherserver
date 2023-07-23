const mongoose = require("mongoose");

const massageSchema = new mongoose.Schema({
  user: {
    type: String,
    required: [true, "Please Provide Name"],
  },
  email: {
    type: String,
    required: [true, "Please Provide Email"],
  },
  massage: {
    type: String,
    required: [true, "Please Fill The Massage"],
  },
  address: {
    type: String,
    required: [true, "Please Fill The Address"],
  },
});

const Massage = mongoose.model("Massage", massageSchema);

module.exports = Massage;
