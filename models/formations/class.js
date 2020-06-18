const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const schema = mongoose.Schema({
    Name: {
        type: String,
        minlength: 1,
        maxlength: 100,
        required: true
    },
    nOfStudents: {
        type: Number,
        min: 1,
        max: 50,
        required: true
    },
    Teacher: {
        type: String,
        minlength: 3,
        maxlength: 100,
        required: true
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
    }],
});

const Class = mongoose.model('Class', schema);

module.exports.Class = Class;
module.exports.validateClass = Joi.object({
    Name: Joi.string().min(1).max(100).required(),
    Teacher: Joi.string().min(3).max(100).required(),
    students: Joi.array().items(Joi.objectId()),
});