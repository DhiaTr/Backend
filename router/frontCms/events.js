const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/events/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '') + file.originalname);
    }
});

const upload = multer({ storage: storage });
const { Event, validateEvent } = require('../../models/frontCms/event');

router.get('/', async (req, res) => {
    res.send(await Event.find());
});

router.get('/lastThree', async (req, res) => {
    res.send(await Event.find().sort([['_id', -1]]).limit(3));
    // get last added 3
});

router.get('/:id', async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send('invalid id.');

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).send('event not found.');

    res.send(event);
});

router.post('/', upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).send('no image selected.');

    const { error } = validateEvent.validate(req.body);
    if (error) res.status(400).send(error.message);

    let startDate = new Date(req.body.startDate);
    let duration = parseInt(req.body.Duration);
    let endDate = startDate.setHours(duration + startDate.getHours());
    endDate = new Date(endDate).toISOString();

    const event = new Event({
        Name: req.body.Name,
        Description: req.body.Description,
        startDate: req.body.startDate,
        endDate: endDate,
        Duration: req.body.Duration,
        location: req.body.location,
        image: req.file.path
    });
    res.send(await event.save());
});

router.put('/:id', upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).send('no image selected.');

    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send('invalid id.');

    let event = await Event.findById(req.params.id);
    if (!event) return res.status(404).send('event not found.');

    const { error } = validateEvent.validate(req.body);
    if (error) res.status(400).send(error.message);

    let startDate = new Date(req.body.startDate);
    let duration = parseInt(req.body.Duration);
    let endDate = startDate.setHours(duration + startDate.getHours());
    endDate = new Date(endDate).toISOString();

    event = await Event.findByIdAndUpdate(req.params.id, {
        Name: req.body.Name,
        Description: req.body.Description,
        startDate: req.body.startDate,
        endDate: endDate,
        Duration: req.body.Duration,
        location: req.body.location,
        image: req.file.path
    }, {
        new: true
    });
    res.send(event);
});

router.delete('/:id', async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send('invalid id.');

    let event = await Event.findById(req.params.id);
    if (!event) return res.status(404).send('event not found.');

    await Event.findByIdAndDelete(req.params.id);
    res.send(event);
});

module.exports = router;