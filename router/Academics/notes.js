const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { Class } = require('../../models/academics/class');
const { Student, validateNote } = require('../../models/academics/student');

router.get('/:studentId', async (req, res) => {
    const students = await Student.findById(req.params.studentId);
    res.send(students.notes);
});

router.get('/:studentId/note/:noteId', async (req, res) => {
    let idStatus = mongoose.Types.ObjectId.isValid(req.params.studentId);
    if (!idStatus) return res.status(400).send('invalid student id.');
    idStatus = mongoose.Types.ObjectId.isValid(req.params.noteId);
    if (!idStatus) return res.status(400).send('invalid note id.');

    const student = await Student.findById(req.params.studentId);
    if (!student) return res.status(404).send('student not found.');
    const note = student.notes.find(s => s._id == req.params.noteId);
    if (!note) return res.status(404).send('note not found!');

    res.send(note);
});

router.post('/:studentId', async (req, res) => {

    let idStatus = mongoose.Types.ObjectId.isValid(req.params.studentId);
    if (!idStatus) return res.status(400).send('invalid student id.');

    const student = await Student.findById(req.params.studentId);
    if (!student) return res.status(400).send('invalid student.');

    const { error } = validateNote.validate(req.body);
    if (error) return res.status(400).send(error.message);

    let _class = await Class.findOne({ 'exams._id': req.body.exam });
    if (!_class) return res.status(400).send('exam not found.');

    const notedExams = student.notes.find(e => e.exam._id == req.body.exam);
    if (notedExams) return res.status(400).send('exam already noted');
    // req body contains exam id directly

    let exam = _class.exams.find(e => e._id == req.body.exam);

    req.body.exam = {
        _id: exam._id,
        Name: exam.Name
    }
    student.notes.push(req.body);
    await Student.findByIdAndUpdate(req.params.studentId, {
        notes: student.notes
    });

    res.send(student);
});

router.put('/:studentId/note/:noteId', async (req, res) => {
    let idStatus = mongoose.Types.ObjectId.isValid(req.params.studentId);
    if (!idStatus) return res.status(400).send('invalid student id.');
    idStatus = mongoose.Types.ObjectId.isValid(req.params.noteId);
    if (!idStatus) return res.status(400).send('invalid note id.');

    const student = await Student.findById(req.params.studentId);
    if (!student) return res.status(404).send('student not found.');
    const note = student.notes.find(s => s._id == req.params.noteId);
    if (!note) return res.status(404).send('note not found!');

    const { error } = validateNote.validate(req.body);
    if (error) return res.status(400).send(error.message);

    let _class = await Class.findOne({ 'exams._id': req.body.exam });
    if (!_class) return res.status(400).send('exam not found.');

    let exam = _class.exams.find(e => e._id == req.body.exam);


    student.notes = student.notes.map(n => {
        if (n._id == req.params.noteId) {
            return {
                _id: n._id,
                exam: {
                    _id: exam._id,
                    Name: exam.Name
                },
                value: req.body.value
            }
        }
        return n;
    });
    await Student.findByIdAndUpdate(req.params.studentId, {
        notes: student.notes
    });
    res.send(student);
});

router.delete('/:studentId/note/:noteId', async (req, res) => {
    let idStatus = mongoose.Types.ObjectId.isValid(req.params.studentId);
    if (!idStatus) return res.status(400).send('invalid student id.');
    idStatus = mongoose.Types.ObjectId.isValid(req.params.noteId);
    if (!idStatus) return res.status(400).send('invalid note id.');

    const student = await Student.findById(req.params.studentId);
    if (!student) return res.status(404).send('student not found.');
    const note = student.notes.find(s => s._id == req.params.noteId);
    if (!note) return res.status(404).send('note not found!');

    student.notes = student.notes.filter(n => n._id != req.params.noteId);
    await Student.findByIdAndUpdate(req.params.studentId, {
        notes: student.notes
    });
    res.send(student);
});



module.exports = router;