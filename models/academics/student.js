const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);

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
  BirthDate: {
    type: Date,
    min: "1970-01-01",
    max: "2015-01-01",
    required: true,
  },
  Gender: {
    type: String,
    minlength: 3,
    maxlength: 100,
    required: true,
  },
  guardian: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Guardian",
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024,
    required: true,
  },
  notes: [{
    exam: {
      _id: mongoose.Schema.Types.ObjectId,
      Name: {
        type: String,
        minlength: 2,
        maxlength: 100,
        required: true
      }
    },
    value: {
      type: Number,
      minlength: 0,
      maxlength: 20,
      required: true,
    },
  }]
});

const Student = mongoose.model("Student", schema);

module.exports.Student = Student;
module.exports.validateStudent = Joi.object({
  Name: Joi.string().min(10).max(200).required(),
  phone: Joi.string().min(8).max(20).required(),
  Email: Joi.string().min(10).max(100).required(),
  Gender: Joi.string().min(3).max(100).required(),
  Address: Joi.string().min(10).max(255).required(),
  BirthDate: Joi.date().min("1970-01-01").max("2015-01-01").required(),
  guardian: Joi.string().min(8).max(8).required(),
  password: Joi.string().min(5).max(1024).required()
});
module.exports.validateChange = Joi.object({
  Name: Joi.string().min(10).max(200).required(),
  phone: Joi.string().min(8).max(20).required(),
  Gender: Joi.string().min(3).max(100).required(),
  Address: Joi.string().min(10).max(255).required(),
  BirthDate: Joi.date().min("1970-01-01").max("2015-01-01").required(),
  guardian: Joi.string().min(8).max(8).required(),
  password: Joi.string().min(5).max(1024).required()
});

module.exports.validateNote = Joi.object({
  exam: Joi.objectId(),
  value: Joi.number().min(0).max(20).required()
});
// add birthdate min and max to validation