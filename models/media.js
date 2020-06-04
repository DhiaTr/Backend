const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const schema = mongoose.Schema({
    path: {
        type: String,
        minlength: 10,
        maxlength: 1024,
        required: true
    }
});

const Media = mongoose.model('Media', schema);

function validateMedia(Media) {
    const schema = {
        path: Joi.string().min(5).max(1024).required()
    }
    return Joi.validate(Media, schema);
}

module.exports.Media = Media;
module.exports.validateMedia = validateMedia;
