const express = require("express");
const cors = require("cors");
const transactions = require("../routes/transactions");
const users = require("../routes/users");

module.exports = function (app) {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/", transactions);
  app.use("/", users);
};
