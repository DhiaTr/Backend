const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const schema = mongoose.Schema({
    Name: {
        type: String,
        minlength: 2,
        maxlength: 100,
        required: true
    },
    Description: {
        type: String,
        minlength: 10,
        maxlength: 150,
        required: true
    },
    formations: [{
        Name: {
            type: String,
            minlength: 5,
            maxlength: 100,
            required: true
        },
        Description: {
            type: String,
            minlength: 10,
            maxlength: 150,
            required: true
        },
        Price: {
            type: Number,
            min: 0,
            max: 100000,
            required: true
        },
        durationInMonths: {
            type: Number,
            min: 1,
            max: 20,
            required: true
        },
        image: {
            type: String,
            minlength: 10,
            maxlength: 1024,
            required: true
        },
    }]
});

const Page = mongoose.model('Page', schema);

module.exports.Page = Page;
module.exports.validatePage = Joi.object({
    Name: Joi.string().min(2).max(100).required(),
    Description: Joi.string().min(10).max(150).required()
});
module.exports.validateFormation = Joi.object({
    formation: Joi.objectId(),
});