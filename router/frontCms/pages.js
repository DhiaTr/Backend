const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { Page } = require('../../models/frontCms/page');
const { Formation } = require('../../models/formations/formation');

router.get('/', async (req, res) => {
    res.send(await Page.find());
});

router.post('/', async (req, res) => {
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
        f = {
            Name: formation.Name,
            Description: formation.Description,
            thumbnail: formation.thumbnail
        }
        formations.push(f);
    }

    page = {
        Name: req.body.Name,
        Description: req.body.Description,
        formations: formations
    }
    const returnNew = { new: true };
    res.send(await Page.findByIdAndUpdate(req.params.id, page, returnNew));

});

router.delete('/:id', async (req, res) => {

    const PageIdStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!PageIdStatus) return res.status(400).send('invalid id.');

    let page = await Page.findById(req.params.id);
    if (!page) return res.status(404).send('page not found.')

    page = await Page.findByIdAndDelete(req.params.id);
    res.send(page);

});

module.exports = router;