const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);

const schema = mongoose.Schema({
  CIN: {
    type: String,
    minlength: 8,
    maxlength: 8,
    required: true,
  },
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
  Parish: [{
    Relation: {
      type: String,
      minlength: 3,
      maxlength: 100,
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    }
  }],
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
  CIN: Joi.string().min(8).max(8).required(),
  Name: Joi.string().min(10).max(200).required(),
  phone: Joi.string().min(8).max(20).required(),
  Occupation: Joi.string().min(10).max(100).required(),
  Email: Joi.string().min(10).max(100).required(),
  Address: Joi.string().min(10).max(255).required(),
  Parish: Joi.array().items({
    Relation: Joi.string().min(3).max(100).required(),
    studentId: Joi.objectId()
  }),
  password: Joi.string().min(5).max(1024).required()
});
