const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema({
  title: {
    type: String,
    require: true,
  },

  debit: {
    type: Number,
  },

  credit: {
    type: Number,
  },
  date: {
    type: String,
    required: true,
  },
  user: {
    _id: mongoose.Types.ObjectId,
    name: {
      type: String,
      required: true,
    },
    wallet: {
      type: Number,
      required: true,
    },
  },
});

exports.Transaction = mongoose.model("Transaction", transactionSchema);
exports.transactionSchema = transactionSchema;
