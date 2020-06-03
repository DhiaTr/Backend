const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { Formation } = require('../models/formation');

router.get('/', async (req, res) => {
    res.send('1');
});

router.post('/', async (req, res) => {

    const id = mongoose.Types.ObjectId();
    const formation = new Formation({
        Name: req.body.Name,
        Description: req.body.Description,
        tags: req.body.tags,
        imagePath: { _id: id, path: 'testpath1dfsdfsdfsdf' },
        thumbnailPath: { _id: id, path: 'testpath2sdfsdfsdf' },
        Menu: { _id: id, Name: 'testName1sdfsdfsd' }

    });
    res.send(await formation.save());


});

module.exports = router;