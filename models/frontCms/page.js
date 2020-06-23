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
        thumbnail: {
            type: new mongoose.Schema({
                path: {
                    type: String,
                    minlength: 10,
                    maxlength: 1024,
                    required: true
                }
            })
        }
    }]
});

const Page = mongoose.model('Page', schema);

function validatePage() {
    return Joi.object({
        Name: Joi.string().min(5).max(100).required(),
        Description: Joi.string().min(10).max(150).required(),
    })
}

module.exports.Page = Page;
module.exports.validatePage = validatePage;