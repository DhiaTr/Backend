const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const { Event, validateEvent } = require('../../models/frontCms/event');

router.get('/', async (req, res) => {
    res.send(await Event.find());
});

router.get('/:id', async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send('invalid id.');

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).send('event not found.');

    res.send(event);
});

router.post('/', async (req, res) => {
    const { error } = validateEvent.validate(req.body);
    if (error) res.status(400).send(error.message);

    const event = new Event({
        Name: req.body.Name,
        Description: req.body.Description,
        startDate: req.body.startDate,
        Duration: req.body.Duration,
        location: req.body.location
    });
    res.send(await event.save());
});

router.put('/:id', async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send('invalid id.');

    let event = await Event.findById(req.params.id);
    if (!event) return res.status(404).send('event not found.');

    const { error } = validateEvent.validate(req.body);
    if (error) res.status(400).send(error.message);

    event = await Event.findByIdAndUpdate(req.params.id, {
        Name: req.body.Name,
        Description: req.body.Description,
        startDate: req.body.startDate,
        Duration: req.body.Duration,
        location: req.body.location
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