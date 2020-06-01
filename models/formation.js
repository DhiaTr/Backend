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
        maxlength: 150,
        required: true
    },
    tags: {
        type: String,
        minlength: 20,
        maxlength: 100,
        required: true
    },
    imagePath: {
        type: new mongoose.Schema({
            path: {
                type: String,
                minlength: 10,
                maxlength: 1024,
                required: true
            }
        })
    }
});

const Formation = mongoose.model('Formation', schema);

function validateFormation(Formation) {
    const schema = {
        Name: Joi.string().min(5).max(100).required(),
        Description: Joi.string().min(10).max(150).required(),
        tags: Joi.string().min(20).max(100).required(),
        imagePath: Joi.objectId()
    }
    return Joi.validate(Formation, schema);
}

module.exports.Formation = Formation;
module.exports.validateFormation = validateFormation;