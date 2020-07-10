const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const schema = mongoose.Schema({
    Monday: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
    }],
    Tuesday: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
    }],
    Wednesday: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
    }],
    Thursday: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
    }],
    Friday: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
    }],
    Saturday: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
    }],
    Sunday: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
    }],
});

const Week = mongoose.model('Week', schema);

module.exports.Week = Week;
// module.exports.validateSubject = Joi.object({
//     Monday: Joi.string().min(3).max(100).required(),
//     Description: Joi.string().min(10).max(255).required(),
// });
