const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const schema = mongoose.Schema({
    Name: {
        type: String,
        minlength: 1,
        maxlength: 100,
        required: true
    },
    formation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Formation",
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
    }],
    exams: [{
        Name: {
            type: String,
            minlength: 2,
            maxlength: 100,
            required: true
        },
        Type: {
            type: String,
            minlength: 2,
            maxlength: 100,
            required: true
        },
        TeacherComment: {
            type: String,
            minlength: 5,
            maxlength: 100,
            required: true
        },

    }],
    sessions: [{
        subject: {
            _id: mongoose.Schema.Types.ObjectId,
            Name: {
                type: String,
                minlength: 2,
                maxlength: 100,
                required: true
            }
        },
        weekDay: {
            type: String,
            minlength: 5,
            maxlength: 8,
            required: true
        },
        startTime: {
            type: Number,
            min: 0,
            max: 24,
            required: true
        },
    }],
});

const Class = mongoose.model('Class', schema);

module.exports.Class = Class;
module.exports.validateClass = Joi.object({
    Name: Joi.string().min(1).max(100).required(),
    formation: Joi.objectId(),
});
module.exports.validateStudent = Joi.object({
    student: Joi.objectId(),
});
module.exports.validateExam = Joi.object({
    Name: Joi.string().min(2).max(100).required(),
    Type: Joi.string().min(2).max(100).required(),
    TeacherComment: Joi.string().min(5).max(100).required(),
});

module.exports.validateSession = Joi.object({
    subject: Joi.objectId(),
    weekDay: Joi.string().min(5).max(8).required(),
    startTime: Joi.number().min(0).max(24).required(),
});