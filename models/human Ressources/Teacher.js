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
    Specialty: {
        type: String,
        minlength: 3,
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
    Classes: [{
        type: String,
        minlength: 5,
        maxlength: 1024,
        required: true,
        // to be changed to class type
    }],
    password: {
        type: String,
        minlength: 5,
        maxlength: 1024,
        required: true,
    },
});


const Teacher = mongoose.model("Teacher", schema);

module.exports.Teacher = Teacher;
module.exports.validateTeacher = Joi.object({
    Name: Joi.string().min(10).max(200).required(),
    phone: Joi.string().min(8).max(20).required(),
    Specialty: Joi.string().min(3).max(100).required(),
    Email: Joi.string().min(10).max(100).required(),
    Address: Joi.string().min(10).max(255).required(),
    Classes: Joi.array().items(Joi.objectId()),
    password: Joi.string().min(5).max(1024).required()
});
