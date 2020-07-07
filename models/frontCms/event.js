const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const schema = mongoose.Schema({
    Name: {
        type: String,
        minlength: 5,
        maxlength: 250,
        required: true
    },
    Description: {
        type: String,
        minlength: 10,
        maxlength: 1024,
        required: true
    },
    startDate: {
        type: Date,
        min: '01-01-2020',
        max: '01-01-3020',
        required: true
    },
    endDate: {
        type: Date,
        min: '01-01-2020',
        max: '01-01-3020',
        required: true
    },
    Duration: {
        type: Number,
        min: 1,
        max: 300,
        required: true
    },
    location: {
        type: String,
        minlength: 5,
        maxlength: 250,
        required: true
    },
    image: {
        type: String,
        minlength: 10,
        maxlength: 1024,
        required: true
    },
});

const Event = mongoose.model('Event', schema);
module.exports.Event = Event;
module.exports.validateEvent = Joi.object({
    Name: Joi.string().min(5).max(250).required(),
    Description: Joi.string().min(10).max(1024).required(),
    startDate: Joi.date().min('01-01-2020').max('01-01-3020').required(),
    Duration: Joi.number().min(1).max(300).required(),
    location: Joi.string().min(5).max(250).required()
});
// add constraints to time

