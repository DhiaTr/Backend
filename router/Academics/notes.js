const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { Note, validateNote } = require('../../models/academics/note');
const { Exam } = require('../../models/academics/exam');
const { Student } = require('../../models/academics/student');

router.get('/', async (req, res) => {
    res.send(await Note.find().populate('exam', 'Name').populate('student', 'Name'));
});

router.get('/:id', async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send('invalid id.');

    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).send('invalid note.');

    res.send(await Note.findById(req.params.id).populate('exam', 'Name').populate('student', 'Name'));
});

router.post('/', async (req, res) => {

    const { error } = validateNote.validate(req.body);
    if (error) return res.status(400).send(error.message);

    const exam = await Exam.findById(req.body.exam);
    if (!exam) return res.status(400).send('invalid exam.');

    const student = await Student.findOne({ Email: req.body.student });
    if (!student) return res.status(400).send('invalid student.');

    const note = new Note({
        exam: req.body.exam,
        student: student._id,
        date: req.body.date,
        value: req.body.value
    });

    res.send(await note.save());
});

router.put('/:id', async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send('invalid id.');

    let note = await Note.findById(req.params.id);
    if (!note) return res.status(404).send('invalid note.');

    const { error } = validateNote.validate(req.body);
    if (error) return res.status(400).send(error.message);

    const exam = await Exam.findById(req.body.exam);
    if (!exam) return res.status(400).send('invalid exam.');

    const student = await Student.findOne({ Email: req.body.student });
    if (!student) return res.status(400).send('invalid student.');

    note = await Note.findByIdAndUpdate(req.params.id, {
        exam: req.body.exam,
        student: student._id,
        date: req.body.date,
        value: req.body.value
    }, {
        new: true
    });

    res.send(note);
});

router.delete('/:id', async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send('invalid id.');

    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).send('invalid note.');

    await Note.findByIdAndDelete(req.params.id);
    res.send(note);
});



module.exports = router;