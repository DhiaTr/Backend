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
    Description: {
        type: String,
        minlength: 10,
        max: 255,
        required: true
    },
    exams: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam",
    }]
});

const Subject = mongoose.model('Subject', schema);

module.exports.Subject = Subject;
module.exports.validateSubject = Joi.object({
    Name: Joi.string().min(3).max(100).required(),
    Description: Joi.string().min(10).max(255).required(),
});
