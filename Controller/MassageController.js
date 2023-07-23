const Massage = require("../Models/Massages");
const { ErrorHandler } = require("../Utils/errohandler");
const asyncError = require("../Utils/asyncError");

exports.createMassage = asyncError(async (req, res, next) => {
  const { name, massage, email, address } = req.body;

  const massageNew = await Massage.create({
    user: name,
    massage: massage,
    address: address,
    email: email,
  });

  res.status(200).json({
    success: true,
    massageNew,
  });
});

exports.getAllMassage = asyncError(async (req, res, next) => {
  const massages = await Massage.find();
  if (!massages) {
    return next(new ErrorHandler(404, "Massage not found"));
  }
  res.status(200).json({
    success: true,
    massages,
  });
});

exports.getSingleMassage = asyncError(async (req, res, next) => {
  const { email } = req.body;
  const massage = await Massage.findOne(email);
  if (!massage) {
    return next(new ErrorHandler(404, "Massage not found"));
  }
  res.status(200).json({
    success: true,
    massage,
  });
});
