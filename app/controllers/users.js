const express = require("express");
const { User } = require("../models/User");
const { validate } = require("../validation/validateUser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const validUser = await User.findOne({ email: req.body.email });
  if (!validUser)
    return res.status(404).send("No User is register with this email id");

  const authentication = await bcrypt.compare(
    req.body.password,
    validUser.password
  );
  if (!authentication) return res.status(400).send("wrong credentials");

  const token = validUser.generateToken();
  res.send({ message: "Successfull login", token });
};

exports.register = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const validUser = await User.findOne({ email: req.body.email });
  if (validUser) return res.status(400).send("Email Id already exists");

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const salt = await bcrypt.genSalt(10);
  const hashPwd = await bcrypt.hash(user.password, salt);

  user.password = hashPwd;
  const token = user.generateToken();
  const result = await user.save();
  res.send({ message: "succesfully login", token });
};

// get single user

exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send("Agent user not Found");

  res.send({
    name: user.name,
    email: user.email,
    wallet: user.wallet,
  });
};
