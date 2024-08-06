const asyncHandler = require("express-async-handler");
const Category = require("../model/Category");

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
  update: asyncHandler(async (req, res) => {}),
  // delete
  delete: asyncHandler(async (req, res) => {}),
};

module.exports = categoryController;
// now we have to call with the help of router
// each controller have their route.
