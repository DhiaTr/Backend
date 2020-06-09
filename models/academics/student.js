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
    max: "2008-01-01",
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
  }

});

schema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id, role: 'student' }, config.get('jwtPrivateKey'));
}

const Student = mongoose.model("Student", schema);

module.exports.Student = Student;
module.exports.validateStudent = Joi.object({
  Name: Joi.string().min(10).max(200).required(),
  phone: Joi.string().min(8).max(20).required(),
  Email: Joi.string().min(10).max(100).required(),
  Gender: Joi.string().min(3).max(100).required(),
  Address: Joi.string().min(10).max(255).required(),
  BirthDate: Joi.string().required(),
  guardian: Joi.objectId(),
  Address: Joi.string().min(5).max(1024).required(),
});
