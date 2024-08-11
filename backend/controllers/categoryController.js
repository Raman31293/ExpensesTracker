const asyncHandler = require("express-async-handler");
const Category = require("../model/Category");
const Transaction = require("../model/Transaction");

const categoryController = {
  // add
  create: asyncHandler(
    // wrap this callback in asynchandler
    async (req, res) => {
      //destructuring  here name is name of category
      const { name, type } = req.body;
      // validation for empty fields
      if (!name || !type) {
        throw new Error("Name and type required for creating a category");
      }
      //  convert to lowercase
      const lowerName = name.toLowerCase();
      // check if the type is valid
      const validTypes = ["income", "expense"];
      if (!validTypes.includes(type.toLowerCase())) {
        throw new Error("Invalid category type" + type);
      }
      // if category already exists first check by name then by user
      const categoryExists = await Category.findOne({
        name: lowerName,
        user: req.user,
      });
      if (categoryExists) {
        throw new Error(
          `Category ${categoryExists.name} already exists in the data base`
        );
      }
      // crete the category
      const category = await Category.create({
        name: lowerName,
        user: req.user,
        type,
      });
      res.status(200).json(category);
    }
  ),
  //   Lists
  lists: asyncHandler(async (req, res) => {
    const categories = await Category.find({ user: req.user });
    res.status(200).json(categories);
  }),
  //   Updatae
  update: asyncHandler(async (req, res) => {
    const categoryId = req.params.id;
    const { type, name } = req.body;
    const normalizeName = name.toLowerCase();
    const category = await Category.findById(categoryId);
    if (!category && category.user.toString() !== req.user.toString()) {
      throw new Error("category not found or user not authorize");
    }
    const oldName = category.name;
    // update properties
    category.name = name;
    category.type = type;
    const updatedCategory = await category.save();
    // update affected transaction
    if (oldName !== updatedCategory.name) {
      await Transaction.updateMany(
        {
          user: req.user,
          category: oldName,
        },
        {
          $set: { category: updatedCategory.name },
        }
      );
      res.json(updatedCategory);
    }
  }),
  // delete
  delete: asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (category && category.user.toString() === req.user.toString()) {
      // whenever user going to delete category it will set category to bydefault uncategorized
      const defaultCategory = "Uncategorized";
      await Transaction.updateMany(
        { user: req.user, category: category.name },
        { $set: { category: defaultCategory } }
      );
      // remove category
      await Category.findByIdAndDelete(req.params.id);
      res.json({ message: "Category removed and transactions update " });
    } else {
      res.json({ message: "Category not found or user not authorized" });
    }
  }),
};

module.exports = categoryController;
// now we have to call with the help of router
// each controller have their route.
