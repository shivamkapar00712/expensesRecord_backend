const express = require("express");
const Joi = require("joi");

exports.validate = function (txn) {
  const schema = Joi.object({
    title: Joi.string().required().min(3).max(255),
    debit: Joi.number(),
    credit: Joi.number(),
    date: Joi.date().iso().required(),
  });

  return schema.validate(txn);
};
