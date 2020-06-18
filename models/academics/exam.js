const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const schema = mongoose.Schema({
    Name: {
        type: String,
        minlength: 2,
        maxlength: 30,
        required: true
    },
    DateTime: {
        type: Date,
        required: true
    },
});

const Exam = mongoose.model('Exam', schema);

module.exports.Exam = Exam;
module.exports.validateExam = Joi.object({
    Name: Joi.string().min(2).max(30).required(),
    DateTime: Joi.date().required(),
});