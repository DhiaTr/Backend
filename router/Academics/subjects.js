const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { Subject, validateSubject } = require('../../models/academics/subject');


router.get('/', async (req, res) => {
    res.send(await Subject.find());
});

router.get('/:id', async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send('invalid id.');

    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).send('invalid subject.');

    res.send(subject);
});

router.post('/', async (req, res) => {
    const { error } = validateSubject.validate(req.body);
    if (error) return res.status(400).send(error.message);

    const subject = new Subject({
        Name: req.body.Name,
        Description: req.body.Description
    });

    res.send(await subject.save());
});

router.put('/:id', async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send('invalid id.');

    let subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).send('invalid subject.');

    const { error } = validateSubject.validate(req.body);
    if (error) return res.status(400).send(error.message);

    subject = await Subject.findByIdAndUpdate(req.params.id, {
        Name: req.body.Name,
        Description: req.body.Description
    }, {
        new: true
    });

    res.send(subject);
});

router.delete('/:id', async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send('invalid id.');

    let subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).send('invalid subject.');

    await Subject.findByIdAndDelete(req.params.id);
    res.send(subject);
});



module.exports = router;