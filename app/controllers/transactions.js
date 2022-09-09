const express = require("express");
const { date } = require("joi");
const mongoose = require("mongoose");
const { Transaction } = require("../models/Transaction");
const { User } = require("../models/User");
const { validate } = require("../validation/validateTxn");

//All transactions
module.exports.allTransactions = async (req, res) => {
  const { user } = req;
  const transactions = await Transaction.find({ "user._id": user.id });
  console.log(transactions);
  res.send(transactions);
};

// Single transaction
module.exports.transaction = async (req, res) => {
  const txn = await Transaction.findById(req.params.id);
  res.send(txn);
};

module.exports.addTxn = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.user.id);
  if (!user) return res.status(400).send("Target Not Found");

  const newBalance =
    parseInt(user.wallet) -
    parseInt(req.body.debit) +
    parseInt(req.body.credit);

  const txn = new Transaction({
    title: req.body.title,
    debit: req.body.debit,
    credit: req.body.credit,
    date: req.body.date,
    user: {
      _id: req.user.id,
      name: req.user.name,
      wallet: newBalance,
    },
  });

  if (newBalance < 0)
    return res.status(400).send("Insufficient Fund in wallet");

  // updating user wallet
  const oldBalance = user.wallet;
  user.wallet = newBalance;

  try {
    await user.save();
    const result = await txn.save();
    res.send(result);
  } catch (ex) {
    user.wallet = oldBalance;
    console.log("reverting");
    await user.save();
    console.log(user, ex);
    res.status(400).send(ex);
  }
};

module.exports.transferToAnotherWallet = async (req, res) => {
  const customer = await User.find({ email: req.body.email });
  if (!customer) return res.status(400).send("Target Not Found");

  const user = await User.findById(req.user.id);
  if (!user) return res.status(500).send("Authentication error");

  const customerWallet = parseInt(customer.wallet) + parseInt(req.body.amount);

  const newBalance = parseInt(user.wallet) - parseInt(req.body.amount);

  if (newBalance < 0)
    return res.status(400).send("Insufficient Fund in wallet");

  // updating user wallet
  const oldBalanceOfCustomer = customer.wallet;
  const oldBalanceOfUser = req.user.wallet;
  customer.wallet = customerWallet;
  user.wallet = newBalance;
  const date = new Date();
  const txnOfCustomer = new Transaction({
    title: `Fund Added by ${user.name}`,
    debit: 0,
    credit: req.body.amount,
    date: `${date.getFullYear}/${date.Month}/${date.Date}`,
    user: {
      _id: customer._id,
      name: customer.name,
      wallet: customerWallet,
    },
  });
  const txnOfUser = new Transaction({
    title: `Fund Transfer to ${customer.name}`,
    debit: req.body.amount,
    credit: 0,
    date: `${date.getFullYear}/${date.Month}/${date.Date}`,
    user: {
      _id: req.user.id,
      name: req.user.name,
      wallet: newBalance,
    },
  });

  try {
    customer.save().then((cust) => {
      user
        .save()
        .then((u) => {
          txnOfCustomer.save().then((cusTxn) => {
            txnOfUser.save().then((userTxn) => res.send("fund transfered"));
          });
        })
        .catch((err) => {
          customer.wallet = oldBalanceOfCustomer;
          customer.save();
        });
    });
  } catch (ex) {
    customer.wallet = oldBalanceOfCustomer;
    user.wallet = oldBalanceOfUser;
    console.log("reverting");
    await user.save();
    await customer.save();
    console.log(user, ex);
    res.status(400).send(ex);
  }
};
