const mongoose = require('mongoose');

const schema = mongoose.Schema({
    path: {
        type: String,
        minlength: 10,
        maxlength: 1024,
        required: true
    }
});

const Media = mongoose.model('Media', schema);
module.exports.Media = Media;

