const Category = require("../Models/Category");
const asyncError = require("../Utils/asyncError");

exports.createCategory = asyncError(async (req, res, next) => {
  const { name } = req.body;

  const category = await Category.create({ name });

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    category,
  });
});

exports.getAllCategories = asyncError(async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).json({
    success: true,
    categories,
  });
});

exports.deleteCategory = asyncError(async (req, res, next) => {
  const { id } = req.params;
  await Category.findByIdAndDelete(id);
  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});
