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
    // Teacher: {
    //     type: String,
    //     minlength: 3,
    //     maxlength: 100,
    //     required: true
    // },
    formation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Formtaion",
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
    formation: Joi.objectId(),
    // Teacher: Joi.string().min(3).max(100).required(),
});
module.exports.validateStudent = Joi.object({
    student: Joi.objectId(),
});