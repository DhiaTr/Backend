const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const schema = mongoose.Schema({
    Name: {
        type: String,
        minlength: 5,
        maxlength: 100,
        required: true
    },
    path: {
        type: String,
        minlength: 10,
        maxlength: 1024,
        required: true
    },
    description: {
        type: String,
        minlength: 30,
        maxlength: 1024,
        required: true
    }
});

const Media = mongoose.model('Media', schema);

function validateMedia(Media) {
    const schema = {
        Name: Joi.string().min(5).max(100).required(),
        path: Joi.string().min(5).max(1024).required(),
        Description: Joi.string().min(10).max(150).required()
    }
    return Joi.validate(Media, schema);
}

module.exports.Media = Media;
module.exports.validateMedia = validateMedia;
