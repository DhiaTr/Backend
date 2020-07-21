const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const schema = mongoose.Schema({
    Name: {
        type: String,
        minlength: 5,
        maxlength: 100,
        required: true
    },
    Description: {
        type: String,
        minlength: 10,
        maxlength: 1024,
        required: true
    },
    image: {
        type: String,
        minlength: 10,
        maxlength: 1024,
        required: true
    },
    durationInMonths: {
        type: Number,
        min: 1,
        max: 300,
        required: true
    },
    Price: {
        type: Number,
        min: 0,
        max: 100000,
        required: true
    },
    nOfLectures: {
        type: Number,
        min: 1,
        max: 1000,
        required: true
    },
    subjects: [{
        type: new mongoose.Schema({
            Name: {
                type: String,
                minlength: 2,
                maxlength: 100,
                required: true
            },
            Description: {
                type: String,
                minlength: 5,
                maxlength: 1024,
                required: true
            }
        }),
    }],
});

const Formation = mongoose.model('Formation', schema);


module.exports.Formation = Formation;
module.exports.validateFormation = Joi.object({
    Name: Joi.string().min(5).max(100).required(),
    Description: Joi.string().min(10).max(1024).required(),
    durationInMonths: Joi.number().min(1).max(300).required(),
    Price: Joi.number().min(0).max(100000).required(),
    nOfLectures: Joi.number().min(1).max(1000).required(),
});

module.exports.validateSubject = Joi.object({
    Name: Joi.string().min(2).max(100).required(),
    Description: Joi.string().min(5).max(1024).required(),
})