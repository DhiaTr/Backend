const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { Class, validateSession } = require('../../models/academics/class');
const { Formation } = require('../../models/academics/formation');

router.get('/:classId', async (req, res) => {
    // add checking for classId in the other routes with array storage
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.classId);
    if (!idStatus) return res.status(400).send('invalid class Id');

    const _class = await Class.findById(req.params.classId);
    if (!_class) return res.status(404).send('class not found.');

    res.send(_class.sessions);

});

router.get('/:classId/session/:sessionId', async (req, res) => {
    let idStatus = mongoose.Types.ObjectId.isValid(req.params.classId);
    if (!idStatus) return res.status(400).send('invalid class Id');
    idStatus = mongoose.Types.ObjectId.isValid(req.params.sessionId);
    if (!idStatus) return res.status(400).send('invalid session Id');

    const _class = await Class.findById(req.params.classId);
    if (!_class) return res.status(404).send('class not found.');
    const session = _class.sessions.find(s => s._id == req.params.sessionId);
    if (!session) return res.status(404).send('session not found.');

    res.send(session);
});

router.post('/:classId', async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.classId);
    if (!idStatus) return res.status(400).send('invalid class Id');

    const _class = await Class.findById(req.params.classId);
    if (!_class) return res.status(404).send('class not found.');

    const { error } = validateSession.validate(req.body);
    if (error) return res.status(400).send(error.message);

    // look for a solution for the type (== against ===))
    const formation = await Formation.findOne({ 'subjects._id': req.body.subject });
    if (!formation) return res.status(400).send('subject not found.');
    const subject = formation.subjects.find(s => s._id == req.body.subject);

    // makes only one session per class at an hour
    let session = _class.sessions.find(s => (s.weekDay == req.body.weekDay && s.startTime == req.body.startTime));
    if (session) return res.status(400).send('timing already occupied');

    session = {
        subject: {
            _id: subject._id,
            Name: subject.Name
        },
        weekDay: req.body.weekDay,
        startTime: req.body.startTime
    };

    _class.sessions.push(session);
    await Class.findByIdAndUpdate(req.params.classId, _class);

    res.send(session);
});

router.put('/:classId/session/:sessionId', async (req, res) => {
    let idStatus = mongoose.Types.ObjectId.isValid(req.params.classId);
    if (!idStatus) return res.status(400).send('invalid class Id');
    idStatus = mongoose.Types.ObjectId.isValid(req.params.sessionId);
    if (!idStatus) return res.status(400).send('invalid session Id');

    const _class = await Class.findById(req.params.classId);
    if (!_class) return res.status(404).send('class not found.');
    let session = _class.sessions.find(s => s._id == req.params.sessionId);
    if (!session) return res.status(404).send('session not found.');

    const { error } = validateSession.validate(req.body);
    if (error) return res.status(400).send(error.message);

    const formation = await Formation.findOne({ 'subjects._id': req.body.subject });
    if (!formation) return res.status(400).send('subject not found.');
    const subject = formation.subjects.find(s => s._id == req.body.subject);

    session = _class.sessions.find(s => (s.weekDay == req.body.weekDay && s.startTime == req.body.startTime && s._id != req.params.sessionId));
    if (session) return res.status(400).send('timing already occupied');

    _class.sessions = _class.sessions.map(s => {
        if (s._id == req.params.sessionId)
            return {
                _id: s._id,
                subject: {
                    _id: subject._id,
                    Name: subject.Name
                },
                weekDay: req.body.weekDay,
                startTime: req.body.startTime
            };
        return s;
    });

    await Class.findByIdAndUpdate(req.params.classId, _class);
    res.send(_class.sessions);
});

router.delete('/:classId/session/:sessionId', async (req, res) => {
    let idStatus = mongoose.Types.ObjectId.isValid(req.params.classId);
    if (!idStatus) return res.status(400).send('invalid class Id');
    idStatus = mongoose.Types.ObjectId.isValid(req.params.sessionId);
    if (!idStatus) return res.status(400).send('invalid session Id');

    const _class = await Class.findById(req.params.classId);
    if (!_class) return res.status(404).send('class not found.');
    let session = _class.sessions.find(s => s._id == req.params.sessionId);
    if (!session) return res.status(404).send('session not found.');

    _class.sessions = _class.sessions.filter(s => s._id != req.params.sessionId);
    await Class.findByIdAndUpdate(req.params.classId, _class);
    res.send(_class.sessions);
});




module.exports = router;