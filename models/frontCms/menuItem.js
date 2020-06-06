const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi)

const schema = mongoose.Schema({
    menu: {
        type: new mongoose.Schema({
            Name: {
                type: String,
                minlength: 5,
                maxlength: 100,
                required: true
            }
        })
    },
    page: {
        type: new mongoose.Schema({
            Name: {
                type: String,
                minlength: 5,
                maxlength: 100,
                required: true
            }
        })
    }
});

function validateMeniItem() {
    return Joi.object({
        menu: Joi.object().required(),
        page: Joi.object().required()
    })
}

const MenuItem = mongoose.model('MenuItem', schema);

module.exports.MenuItem = MenuItem;
module.exports.validateMeniItem = validateMeniItem;