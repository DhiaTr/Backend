const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi)

const schema = mongoose.Schema({
    img: {
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

const GalleryImage = mongoose.model('GalleryImage', schema);

function validateGalleryImage() {
    return Joi.object({
        img: Joi.object().required()
    })
}

module.exports.GalleryImage = GalleryImage;
module.exports.validateGalleryImage = validateGalleryImage;