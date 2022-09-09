const express = require("express");
const router = express.Router();
const {
  allTransactions,
  transaction,
  addTxn,
  transferToAnotherWallet,
} = require("../controllers/transactions");
const auth = require("../middleware/auth");

//Sharing a particular transaction
router.get("/transactions/:id", auth, transaction);

// Sharing All transactions
router.get("/transactions", auth, allTransactions);

// add transaction
router.post("/transactions", auth, addTxn);

// transfer fund to another wallet --> Work in progress
router.post("/pay-to-user", auth, transferToAnotherWallet);

// exporting router
module.exports = router;
