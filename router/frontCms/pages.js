const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { Page } = require('../../models/frontCms/page');
const { Media } = require('../../models/frontCms/media');
const { Formation } = require('../../models/formation');

router.get('/', async (req, res) => {
    res.send(await Page.find());
});

router.post('/', async (req, res) => {

    // for (var i = 0; i < req.body.formations.length; i++) {
    //     const formation = await Formation.findById(req.body.formations[i]);
    //     if (!formation) return res.status(404).send('');
    // }

    const formation = new Page({
        Name: req.body.Name,
        Description: req.body.Description,
        formations: []
    });
    res.send(await formation.save());
});

router.put('/:id', async (req, res) => {

    const pageIdStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!pageIdStatus) return res.status(400).send('invalid id.');

    let page = await Page.findById(req.params.id);
    if (!page) return res.status(404).send('Page not found.');

    let formations = [];
    let f = {};
    for (var i = 0; i < req.body.formations.length; i++) {
        const formation = await Formation.findById(req.body.formations[i]);
        if (!formation) return res.status(404).send('formation not found.');
        let f = {
            Name: formation.Name,
            Description: formation.Description,
            thumbnail: formation.thumbnail
        }
        formations.push(f);
        console.log(formations);
    }

    page = {
        Name: req.body.Name,
        Description: req.body.Description,
        formations: formations
    }
    const returnNew = { new: true };
    res.send(await Page.findByIdAndUpdate(req.params.id, page, returnNew));

});



module.exports = router;