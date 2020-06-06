const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { Page } = require('../../models/frontCms/page');
const { Media } = require('../../models/frontCms/media');


router.get('/', async (req, res) => {
    res.send(await Page.find());
});

router.post('/', async (req, res) => {

    const image = await Media.findById(req.body.image);
    const thumbnail = await Media.findById(req.body.thumbnail);
    const formation = new Formation({
        Name: req.body.Name,
        Description: req.body.Description,
        tags: req.body.tags,
        image: { _id: image._id, path: image.path },
        thumbnail: { _id: thumbnail._id, path: thumbnail.path }
    });
    res.send(await formation.save());
});

module.exports = router;