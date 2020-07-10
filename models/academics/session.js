const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const schema = mongoose.Schema({
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
    },
    weekDay: {
        type: String,
        minlength: 5,
        maxlength: 8,
        required: true
    },
    startHour: {
        type: Number,
        min: 1,
        max: 24,
        required: true
    },
    duration: {
        type: Number,
        min: 1,
        max: 12,
        required: true
    }
});

const Session = mongoose.model('Session', schema);

module.exports.Session = Session;
module.exports.validateSession = Joi.object({
    class: Joi.objectId(),
    subject: Joi.objectId(),
    weekDay: Joi.string().min(5).max(8).required(),
    startHour: Joi.number().min(10).max(24).required(),
    duration: Joi.number().min(1).max(12).required(),
});