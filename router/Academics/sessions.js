const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { Session, validateSession } = require('../../models/academics/session');
const { Class } = require('../../models/academics/class');
const { Subject } = require('../../models/academics/subject');

router.get('/', async (req, res) => {
    res.send(await Session.find().populate('class', 'Name').populate('subject', 'Name'));
});

router.get('/:id', async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send('invalid id.');

    const session = await Session.findById(req.params.id).populate('class', 'Name').populate('subject', 'Name');
    if (!session) return res.status(404).send('invalid Session.');

    res.send(session);
});

router.post('/', async (req, res) => {
    const { error } = validateSession.validate(req.body);
    if (error) return res.status(400).send(error.message);

    const _class = await Class.findById(req.body.class);
    if (!_class) return res.status(400).send('invalid class.');

    const subject = await Subject.findById(req.body.subject);
    if (!subject) return res.status(400).send('invalid subject.');

    // make only one session per class at a time

    const session = new Session({
        class: req.body.class,
        subject: req.body.subject,
        weekDay: req.body.weekDay,
        startHour: req.body.startHour,
        duration: req.body.duration,
    });

    res.send(await session.save());
});

router.put('/:id', async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send('invalid id.');

    let session = await Session.findById(req.params.id);
    if (!session) return res.status(404).send('invalid Session.');

    const { error } = validateSession.validate(req.body);
    if (error) return res.status(400).send(error.message);

    const _class = await Class.findById(req.body.class);
    if (!_class) return res.status(400).send('invalid class.');

    const subject = await Subject.findById(req.body.subject);
    if (!subject) return res.status(400).send('invalid subject.');

    session = await Session.findByIdAndUpdate(req.params.id, {
        class: req.body.class,
        subject: req.body.subject,
        weekDay: req.body.weekDay,
        startHour: req.body.startHour,
        duration: req.body.duration,
    }, {
        new: true
    });

    res.send(session);
});

router.delete('/:id', async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send('invalid id.');

    let session = await Session.findById(req.params.id);
    if (!session) return res.status(404).send('invalid Session.');

    await Session.findOneAndDelete(req.params.id);
    res.send(session);
});




module.exports = router;