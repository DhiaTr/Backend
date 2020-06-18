// const mongoose = require('mongoose');
// const Joi = require('@hapi/joi');
// Joi.objectId = require('joi-objectid')(Joi);

// const schema = mongoose.Schema({
//     Exam: {
//         type: String,
//         minlength: 3,
//         maxlength: 30,
//         required: true
//     },
//     subject: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Student",
//     },
//     startDateTime: {
//         type: Date,
//         required: true
//     },
//     endDateTime: {
//         type: Date,
//         required: true
//     },
// });

// const Session = mongoose.model('Session', schema);

// module.exports.Session = Session;
// module.exports.validateSession = Joi.object({
//     class: Joi.objectId(),
//     subject: Joi.objectId(),
//     startDateTime: Joi.date().required(),
//     endDateTime: Joi.date().required(),
// });