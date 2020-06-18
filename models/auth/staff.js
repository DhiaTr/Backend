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
    Role: {
        type: String,
        minlength: 5,
        maxlength: 100,
        required: true,
    },
    password: {
        type: String,
        minlength: 5,
        maxlength: 1024,
        required: true,
    },
    isSuperAdmin: Boolean
});

schema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id, role: 'Staff', isSuperAdmin: this.isSuperAdmin }, config.get('jwtPrivateKey'));
}

const Staff = mongoose.model("Staff", schema);

module.exports.Staff = Staff;
module.exports.validateStaff = Joi.object({
    Email: Joi.string().min(10).max(100).required(),
    password: Joi.string().min(5).max(1024).required()
});
