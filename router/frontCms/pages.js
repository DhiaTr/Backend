const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { Page, validatePage } = require('../../models/frontCms/page');
const { Formation } = require('../../models/academics/formation');

router.get('/', async (req, res) => {
    res.send(await Page.find());
});

router.get('/:id', async (req, res) => {
    const pageIdStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!pageIdStatus) return res.status(400).send('invalid id.');

    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).send('Page not found.');
    res.send(page);
});

router.post('/', async (req, res) => {

    const { error } = validatePage.validate(req.body);
    if (error) return res.status(400).send(error.message);

    const page = new Page({
        Name: req.body.Name,
        Description: req.body.Description,
        formations: []
    });
    res.send(await page.save());
});

router.put('/:id', async (req, res) => {

    const pageIdStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!pageIdStatus) return res.status(400).send('invalid id.');

    let page = await Page.findById(req.params.id);
    if (!page) return res.status(404).send('Page not found.');

    const { error } = validatePage.validate(req.body);
    if (error) return res.status(400).send(error.message);

    page = await Page.findByIdAndUpdate(req.params.id, {
        Name: req.body.Name,
        Description: req.body.Description,
    }, {
        new: true
    });
    res.send(page);
});

router.put('/:pageId/addItem', async (req, res) => {

    const pageIdStatus = mongoose.Types.ObjectId.isValid(req.params.pageId);
    if (!pageIdStatus) return res.status(400).send('invalid id.');

    let page = await Page.findById(req.params.pageId);
    if (!page) return res.status(404).send('Page not found.');

    let formation = await Formation.findById(req.body.formation);
    if (!formation) return res.status(400).send('invalid formation.');

    page.formations.push({
        _id: formation._id,
        Name: formation.Name,
        Description: formation.Description,
        Price: formation.Price,
        durationInMonths: formation.durationInMonths,
        image: formation.image
    });

    await Page.findByIdAndUpdate(req.params.pageId, {
        formations: page.formations
    });
    res.send(page);
});

router.put('/:pageId/deleteItem/:itemId', async (req, res) => {

    const pageIdStatus = mongoose.Types.ObjectId.isValid(req.params.pageId);
    if (!pageIdStatus) return res.status(400).send('invalid page id.');

    const formationIdStatus = mongoose.Types.ObjectId.isValid(req.params.itemId);
    if (!formationIdStatus) return res.status(400).send('invalid formation id.');

    let page = await Page.findById(req.params.pageId);
    if (!page) return res.status(404).send('Page not found.');

    formation = page.formations.find(f => f._id == req.params.itemId);
    if (!formation) return res.status(400).send('formation not found');

    page.formations = page.formations.filter(f => f._id != req.params.itemId)
    await Page.findByIdAndUpdate(req.params.pageId, page);
    res.send(page);

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