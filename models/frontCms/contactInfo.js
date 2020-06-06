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
        minlength: 30,
        maxlength: 255,
        required: true
    },
    email: {
        type: String,
        minlength: 10,
        maxlength: 255,
        required: true
    },
    FacebookURL: {
        type: String,
        minlength: 20,
        maxlength: 1024,
        required: true
    },
    TwitterURL: {
        type: String,
        minlength: 20,
        maxlength: 1024,
        required: true
    },
    InstagramURL: {
        type: String,
        minlength: 20,
        maxlength: 1024,
        required: true
    },
    LinkedinURL: {
        type: String,
        minlength: 20,
        maxlength: 1024,
        required: true
    }
});

const ContactInFo = mongoose.model('ContactInfo', schema);

function validateContactInfo() {
    return Joi.object({
        phone1: Joi.string().min(8).max(20).required(),
        phone2: Joi.string().min(8).max(20).required(),
        address: Joi.string().min(30).max(255).required(),
        email: Joi.string().min(10).max(255).required(),
        FacebookURL: Joi.string().min(20).max(1024).required(),
        TwitterURL: Joi.string().min(20).max(1024).required(),
        InstagramURL: Joi.string().min(20).max(1024).required(),
        LinkedinURL: Joi.string().min(20).max(1024).required()
    });
}

module.exports.ContactInFo = ContactInFo;
module.exports.validateContactInfo = validateContactInfo;