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

function validateMedia() {
    return Joi.object({
        path: Joi.string().min(10).max(1024).required()
    })
}

module.exports.Media = Media;
module.exports.validateMedia = validateMedia;
