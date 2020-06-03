const mongoose = require('mongoose');

const schema = mongoose.Schema({
    menu: {
        type: new mongoose.Schema({
            Name: {
                type: String,
                minlength: 10,
                maxlength: 1024,
                required: true
            }
        })
    },
    page: {
        type: new mongoose.Schema({
            Name: {
                type: String,
                minlength: 10,
                maxlength: 1024,
                required: true
            }
        })
    }
});

const MenuItem = mongoose.model('MenuItem', schema);

module.exports.MenuItem = MenuItem;