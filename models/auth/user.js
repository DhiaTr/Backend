const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const jwt = require('jsonwebtoken');
const config = require('config');

const schema = mongoose.Schema({
    Email: {
        type: String,
        minlength: 10,
        maxlength: 200,
        required: true,
    },
    password: {
        type: String,
        minlength: 5,
        maxlength: 1024,
        required: true,
    },
    Role: {
        type: String,
        minlength: 3,
        maxlength: 100,
        required: true,
    }
});

schema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id, role: this.role }, config.get('jwtPrivateKey'));
}

const User = mongoose.model("User", schema);

module.exports.User = User;
module.exports.validateUser = Joi.object({
    Email: Joi.string().min(10).max(100).required(),
    password: Joi.string().min(5).max(1024).required()
});
