const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const schema = mongoose.Schema({
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam",
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
    },
    sujet: {
        
    },
    date: {
        type: Date,
        min: "2020-01-01",
        max: "3020-01-01",
        required: true,
    },
    value: {
        type: Number,
        min: 0,
        max: 20,
        required: true
    },
});

const Note = mongoose.model('Note', schema);

module.exports.Note = Note;
module.exports.validateNote = Joi.object({
    exam: Joi.objectId(),
    student: Joi.objectId(),
    date: Joi.date().min('2020-01-01').max('3020-01-01').required(),
    value: Joi.number().min(0).max(20).required()
});