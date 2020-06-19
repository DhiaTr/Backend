const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const schema = mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
    },
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
    },
});

const Abscence = mongoose.model('Abscence', schema);

module.exports.Abscence = Abscence;
module.exports.validateAbscence = Joi.object({
    student: Joi.objectId(),
    session: Joi.objectId(),
});