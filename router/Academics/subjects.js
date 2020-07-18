const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { Subject, validateSubject } = require('../../models/academics/subject');
const { Exam } = require('../../models/academics/exam');

router.get('/', async (req, res) => {
    res.send(await Subject.find());
});

router.get('/:id', async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send('invalid id.');

    const subject = await Subject.findById(req.params.id).populate('exams');
    if (!subject) return res.status(404).send('invalid subject.');

    res.send(subject);
});

router.get('/:id/examsNotInSubject', async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send('invalid id.');

    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).send('invalid subject.');

    const exams = await Exam.find();
    let result = [];
    for (let i = 0; i < exams.length; i++) {
        id = exams[i]._id;
        if (!subject.exams.includes(id))
            result.push(exams[i]);
    }
    res.send(result)
});

router.post('/', async (req, res) => {
    const { error } = validateSubject.validate(req.body);
    if (error) return res.status(400).send(error.message);

    let subject = await Subject.findOne({ Name: req.body.Name });
    if (subject) return res.status(400).send('subject with the same Name Already exists');

    subject = new Subject({
        Name: req.body.Name,
        Description: req.body.Description,
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
        Description: req.body.Description,
    }, {
        new: true
    });

    res.send(subject);
});

router.put('/:subjectId/addExam/:examId', async (req, res) => {
    let idStatus = mongoose.Types.ObjectId.isValid(req.params.subjectId);
    if (!idStatus) return res.status(400).send('invalid subject id.');
    idStatus = mongoose.Types.ObjectId.isValid(req.params.examId);
    if (!idStatus) return res.status(400).send('invalid exam id.');

    let subject = await Subject.findById(req.params.subjectId);
    if (!subject) return res.status(400).send('invalid subject.');

    let exam = await Exam.findById(req.params.examId);
    if (!exam) return res.status(400).send('invalid Exam.');

    exam = subject.exams.find(e => e == req.params.examId);
    if (exam) return res.status(400).send('exam already existant.');

    subject.exams.push(req.params.examId);

    subject = await Subject.findByIdAndUpdate(req.params.subjectId, {
        exams: subject.exams
    }, {
        new: true
    });

    res.send(subject);
});

router.put('/:subjectId/removeExam/:examId', async (req, res) => {
    let idStatus = mongoose.Types.ObjectId.isValid(req.params.subjectId);
    if (!idStatus) return res.status(400).send('invalid subject id.');
    idStatus = mongoose.Types.ObjectId.isValid(req.params.examId);
    if (!idStatus) return res.status(400).send('invalid exam id.');

    let subject = await Subject.findById(req.params.subjectId);
    if (!subject) return res.status(400).send('invalid subject.');

    let exam = await Exam.findById(req.params.examId);
    if (!exam) return res.status(400).send('invalid Exam.');

    exam = subject.exams.find(e => e == req.params.examId);
    if (!exam) return res.status(400).send('exam not existant in asked subject.');

    subject.exams = subject.exams.filter(e => e != req.params.examId);
    subject = await Subject.findByIdAndUpdate(
        req.params.subjectId, {
        exams: subject.exams
    }, { new: true });

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