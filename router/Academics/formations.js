const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { Formation, validateFormation } = require('../../models/formations/formation');
const { Media } = require('../../models/frontCms/media');

router.get('/', async (req, res) => {
    res.send(await Formation.find());
});

router.get('/:id', async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send('invalid id.');

    const formation = await Formation.findById(req.params.id);
    if (!formation) return res.status(404).send('invalid formation.');

    res.send(formation);
});

router.post('/', async (req, res) => {
    const { error } = validateFormation.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const image = await Media.findById(req.body.image);
    if (!image) return res.status(400).send('invalid image.');

    const formation = new Formation({
        Name: req.body.Name,
        Description: req.body.Description,
        Teacher: req.body.Teacher,
        image: { _id: image._id, path: image.path },
        durationInMonths: req.body.durationInMonths,
        Price: req.body.Price,
        nOfLectures: req.body.nOfLectures
    });
    res.send(await formation.save());
});

router.put('/:id', async (req, res) => {

    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send('invalid id.');

    let formation = await Formation.findById(req.params.id);
    if (!formation) return res.status(404).send('formation not found.');

    const { error } = validateFormation.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const image = await Media.findById(req.body.image);
    if (!image) return res.status(400).send('invalid image.');

    formation = await Formation.findByIdAndUpdate(req.params.id, {
        Name: req.body.Name,
        Description: req.body.Description,
        Teacher: req.body.Teacher,
        image: { _id: image._id, path: image.path },
        durationInMonths: req.body.durationInMonths,
        Price: req.body.Price,
        nOfLectures: req.body.nOfLectures
    }, {
        new: true
    });
    res.send(formation);
});

router.delete('/:id', async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send('invalid id.');

    let formation = await Formation.findById(req.params.id);
    if (!formation) return res.status(404).send('formation not found.');

    formation = await Formation.findByIdAndDelete(req.params.id);
    res.send(formation);
});




module.exports = router;