const asyncHandler = require("express-async-handler");
const Transaction = require("../model/Transaction");

const transactionController = {
  // add
  create: asyncHandler(
    // wrap this callback in asynchandler
    async (req, res) => {
      //destructuring  here name is name of category
      const { type, category, amount, date, description } = req.body;
      // validation for empty fields
      if (!type || !amount || !date) {
        throw new Error("Type, amount and date are required ");
      }
      // create transction
      const transaction = await Transaction.create({
        user: req.user,
        type,
        category,
        amount,
        description,
      });
      res.status(201).json(transaction);
    }
  ),
  //   Lists this is for simple list logic of all categories by user name
  // lists: asyncHandler(async (req, res) => {
  //   // to find all the transaction as per individual user
  //   const transactions = await Transaction.find({ user: req.user });
  //   res.status(201).json(transactions);
  // }),
  // filtered list
  getFilteredTransaction: asyncHandler(async (req, res) => {
    // we have over payload in request.query
    const { startDate, endDate, type, category } = req.query;
    // create query object and assign filter properties
    let filters = { user: req.user };

    // applying optional filters
    // $gte i.e grater than
    if (startDate) {
      filters.date = { ...filters.date, $gte: new Date(startDate) };
    }
    if (endDate) {
      filters.date = { ...filters.date, $lte: new Date(endDate) };
    }
    if (type) {
      filters.type = type;
    }
    // category values comes from fronted select by user to apply filter
    if (category) {
      if (category === "All") {
        // no category filter needed when filtering for all
      } else if (category === "Uncategorized") {
        filters.category = "Uncategorized";
      } else {
        filters.category = category;
      }
    }
    // date: -1 means last transaction
    const transactions = await Transaction.find(filters).sort({ date: -1 });

    // accessing response in json format of user transactions
    res.json(transactions);
  }),

  update: asyncHandler(async (req, res) => {
    // find transaction by id
    // id find in params
    const transaction = await Transaction.findById(req.params.id);
    if (transaction && transaction.user.toString() === req.user.toString()) {
      // update value
      (transaction.type = req.body.type || transaction.type),
        (transaction.category = req.body.category || transaction.category),
        (transaction.amount = req.body.amount || transaction.amount),
        (transaction.date = req.body.date || transaction.date),
        (transaction.description =
          req.body.description || transaction.description);
      const updateTransaction = await transaction.save();
      res.json(updateTransaction);
    }
  }),
  // delete
  delete: asyncHandler(async (req, res) => {
    // id find in params
    const transaction = await Transaction.findById(req.params.id);
    if (transaction && transaction.user.toString() === req.user.toString()) {
      await Transaction.findByIdAndDelete(req.params.id);
      res.json({ message: "Transaction removed" });
    }
  }),
};

module.exports = transactionController;
// now we have to call with the help of router
// each controller have their route.
