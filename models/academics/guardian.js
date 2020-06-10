const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const jwt = require('jsonwebtoken');
const config = require('config');

const schema = mongoose.Schema({
  Name: {
    type: String,
    minlength: 10,
    maxlength: 200,
    required: true,
  },
  phone: {
    type: String,
    minlength: 8,
    maxlength: 20,
    required: true,
  },
  Occupation: {
    type: String,
    minlength: 10,
    maxlength: 100,
    required: true,
  },
  Email: {
    type: String,
    minlength: 10,
    maxlength: 100,
    required: true,
  },
  Address: {
    type: String,
    minlength: 10,
    maxlength: 255,
    required: true,
  },
  GuardianRelation: {
    type: String,
    minlength: 5,
    maxlength: 100,
    required: true,
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024,
    required: true,
  }
});


const Guardian = mongoose.model("Guardian", schema);

module.exports.Guardian = Guardian;
module.exports.validateGuardian = Joi.object({
  Name: Joi.string().min(10).max(200).required(),
  phone: Joi.string().min(8).max(20).required(),
  Occupation: Joi.string().min(10).max(100).required(),
  Email: Joi.string().min(10).max(100).required(),
  Address: Joi.string().min(10).max(255).required(),
  GuardianRelation: Joi.string().min(5).max(100).required(),
  password: Joi.string().min(5).max(1024).required()
});
