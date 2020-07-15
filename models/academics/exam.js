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
    Type: {
        type: String,
        minlength: 6,
        maxlength: 9,
        required: true
    },
    Description: {
        type: String,
        minlength: 2,
        maxlength: 50,
        required: true
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
    },
});

const Exam = mongoose.model('Exam', schema);

module.exports.Exam = Exam;
module.exports.validateExam = Joi.object({
    Name: Joi.string().min(2).max(30).required(),
    Type: Joi.string().min(2).max(30).required(),
    Description: Joi.string().min(2).max(50).required(),
    class: Joi.objectId(),
    subject: Joi.objectId()
});