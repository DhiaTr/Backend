const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const jwt = require('jsonwebtoken');
const config = require('config');
Joi.objectId = require("joi-objectid")(Joi);

const schema = mongoose.Schema({
    Name: {
        type: String,
        minlength: 10,
        maxlength: 200,
        required: true,
    },
    phone: {
        type: String,
        minlength: 8,
        maxlength: 20,
        required: true,
    },
    Email: {
        type: String,
        minlength: 10,
        maxlength: 100,
        required: true,
    },
    Address: {
        type: String,
        minlength: 10,
        maxlength: 255,
        required: true,
    },
    employees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employe",
    }],
    password: {
        type: String,
        minlength: 5,
        maxlength: 1024,
        required: true,
    }

});

schema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id, role: 'Entreprise' }, config.get('jwtPrivateKey'));
}

const Entreprise = mongoose.model("Entreprise", schema);

module.exports.Entreprise = Entreprise;
module.exports.validateEntreprise = Joi.object({
    Name: Joi.string().min(10).max(200).required(),
    phone: Joi.string().min(8).max(20).required(),
    Email: Joi.string().min(10).max(100).required(),
    Address: Joi.string().min(10).max(255).required(),
    employees: Joi.array().items(Joi.objectId()),
    password: Joi.string().min(5).max(1024).required()
});
