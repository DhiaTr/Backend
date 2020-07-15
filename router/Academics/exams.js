const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { Exam, validateExam } = require('../../models/academics/exam');
const {  } = require('../../models/academics/student');

router.get('/', async (req, res) => {
    res.send(await Exam.find());
});

router.get('/:id', async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send('invalid id.');

    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).send('invalid exam.');

    res.send(exam);
});

router.post('/', async (req, res) => {
    const { error } = validateExam.validate(req.body);
    if (error) return res.status(400).send(error.message);

    const exam = new Exam({
        Name: req.body.Name,
        Type: req.body.Type,
        Description: req.body.Description,
    });

    res.send(await exam.save());
});

router.put('/:id', async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send('invalid id.');

    let exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).send('invalid exam.');

    const { error } = validateExam.validate(req.body);
    if (error) return res.status(400).send(error.message);

    exam = await Exam.findByIdAndUpdate(req.params.id, {
        Name: req.body.Name,
        Type: req.body.Type,
        Description: req.body.Description,
    }, {
        new: true
    });

    res.send(await exam);
});

router.delete('/:id', async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send('invalid id.');

    let exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).send('invalid exam.');

    await Exam.findByIdAndDelete(req.params.id);
    res.send(exam);
});


module.exports = router;