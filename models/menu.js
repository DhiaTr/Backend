const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

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
    }
});

const Menu = mongoose.model('Menu', schema);

function validateMenu(MenuData) {
    const schema = {
        Name: Joi.string().min(5).max(100).required(),
        Description: Joi.string().min(10).max(150).required()
    }
    return Joi.validate(MenuData, schema);
}

module.exports.Menu = Menu;
module.exports.validateMenu = validateMenu;
