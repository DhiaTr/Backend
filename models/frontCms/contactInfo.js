const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const schema = mongoose.Schema({
    phone1: {
        type: String,
        minlength: 8,
        maxlength: 20,
        required: true
    },
    phone2: {
        type: String,
        minlength: 8,
        maxlength: 20,
        required: true
    },
    address: {
        type: String,
        minlength: 15,
        maxlength: 255,
        required: true
    },
    email: {
        type: String,
        minlength: 10,
        maxlength: 255,
        required: true
    },
    FacebookID: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true
    },
    TwitterID: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true
    },
    InstagramID: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true
    },
    LinkedinID: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true
    }
});

const ContactInFo = mongoose.model('ContactInfo', schema);

function validateContactInfo() {
    return Joi.object({
        phone1: Joi.string().min(8).max(20).required(),
        phone2: Joi.string().min(8).max(20).required(),
        address: Joi.string().min(15).max(255).required(),
        email: Joi.string().min(10).max(255).required(),
        FacebookID: Joi.string().min(5).max(1024).required(),
        TwitterID: Joi.string().min(5).max(1024).required(),
        InstagramID: Joi.string().min(5).max(1024).required(),
        LinkedinID: Joi.string().min(5).max(1024).required()
    });
}

module.exports.ContactInFo = ContactInFo;
module.exports.validateContactInfo = validateContactInfo;