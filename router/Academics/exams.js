const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { Class, validateExam } = require('../../models/academics/class');

router.get('/:classId', async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.classId);
    if (!idStatus) return res.status(400).send('invalid class id.');

    const _class = await Class.findById(req.params.classId);
    if (!_class) return res.status(404).send('class not found.');

    res.send(await _class.exams);
});

router.get('/:classId/exam/:examId', async (req, res) => {
    let idStatus = mongoose.Types.ObjectId.isValid(req.params.classId);
    if (!idStatus) return res.status(400).send('invalid class id.');
    idStatus = mongoose.Types.ObjectId.isValid(req.params.examId);
    if (!idStatus) return res.status(400).send('invalid exam id');

    const _class = await Class.findById(req.params.classId);
    if (!_class) return res.status(404).send('class not found.');
    const exam = _class.exams.find(e => e._id == req.params.examId);
    if (!exam) return res.status(404).send('exam not found.');

    res.send(exam);
});

router.post('/:classId', async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.classId);
    if (!idStatus) return res.status(400).send('invalid class id.');

    const _class = await Class.findById(req.params.classId);
    if (!_class) return res.status(404).send('class not found.');
    const { error } = validateExam.validate(req.body);
    if (error) return res.status(400).send(error.message);

    _class.exams.push(req.body);
    await Class.findByIdAndUpdate(req.params.classId, _class);

    res.send(_class);
});

router.put('/:classId/exam/:examId', async (req, res) => {
    let idStatus = mongoose.Types.ObjectId.isValid(req.params.classId);
    if (!idStatus) return res.status(400).send('invalid class id.');
    idStatus = mongoose.Types.ObjectId.isValid(req.params.examId);
    if (!idStatus) return res.status(400).send('invalid exam id');

    let _class = await Class.findById(req.params.classId);
    if (!_class) return res.status(404).send('class not found.');
    const exam = _class.exams.find(e => e._id == req.params.examId);
    if (!exam) return res.status(404).send('exam not found.');

    const { error } = validateExam.validate(req.body);
    if (error) return res.status(400).send(error.message);

    _class.exams = _class.exams.map(e => {
        if (e._id == req.params.examId) {
            req.body._id = e._id;
            return req.body;
        } else
            return e;
    });
    await Class.findByIdAndUpdate(req.params.classId, _class);

    res.send(_class);
});

router.delete('/:classId/exam/:examId', async (req, res) => {
    let idStatus = mongoose.Types.ObjectId.isValid(req.params.classId);
    if (!idStatus) return res.status(400).send('invalid class id.');
    idStatus = mongoose.Types.ObjectId.isValid(req.params.examId);
    if (!idStatus) return res.status(400).send('invalid exam id');

    let _class = await Class.findById(req.params.classId);
    if (!_class) return res.status(404).send('class not found.');
    const exam = _class.exams.find(e => e._id == req.params.examId);
    if (!exam) return res.status(404).send('exam not found.');

    _class.exams = _class.exams.filter(e => e._id != req.params.examId);
    await Class.findByIdAndUpdate(req.params.classId, _class);
    res.send(_class);
});


module.exports = router;