const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { Student, validateAbscence } = require('../../models/academics/student');
const { Class } = require('../../models/academics/class');

router.get('/:studentId', async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.studentId);
    if (!idStatus) return res.status(400).send('invalid id.');

    const student = await Student.findById(req.params.studentId);
    if (!student) return res.status(404).send('student not found.');

    res.send(student.abscences);
});

router.get('/:studentId/abscence/:abscenceId', async (req, res) => {
    let idStatus = mongoose.Types.ObjectId.isValid(req.params.studentId);
    if (!idStatus) return res.status(400).send('invalid student id.');
    idStatus = mongoose.Types.ObjectId.isValid(req.params.abscenceId);
    if (!idStatus) return res.status(400).send('invalid abscence id.');

    const student = await Student.findById(req.params.studentId);
    if (!student) return res.status(404).send('student not found.');
    const abscence = student.abscences.find(a => a._id == req.params.abscenceId);
    if (!abscence) return res.status(404).send('abscence not found.');

    res.send(abscence);
});

router.post('/:studentId', async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.studentId);
    if (!idStatus) return res.status(400).send('invalid id.');

    const student = await Student.findById(req.params.studentId);
    if (!student) return res.status(404).send('student not found.');

    const { error } = validateAbscence.validate(req.body);
    if (error) return res.status(400).send(error.message);

    const _class = await Class.findOne({ 'sessions._id': req.body.session });
    if (!_class) return res.status(404).send('session not found.');
    const session = _class.sessions.find(s => s._id == req.body.session);

    let abscence = student.abscences.find(a => a.session._id == req.body.session);
    if(abscence) return res.status(400).send('abscence already registred.');

    abscence = {
        session: {
            _id: session._id,
            subjectName: session.subject.Name,
            weekDay: session.weekDay,
            startTime: session.startTime,
        },
        date: new Date().toISOString()
    }

    student.abscences.push(abscence);
    await Student.findByIdAndUpdate(req.params.studentId, student);

    res.send(abscence)
});

router.put('/:studentId/abscence/:abscenceId', async (req, res) => {

    let idStatus = mongoose.Types.ObjectId.isValid(req.params.studentId);
    if (!idStatus) return res.status(400).send('invalid student id.');
    idStatus = mongoose.Types.ObjectId.isValid(req.params.abscenceId);
    if (!idStatus) return res.status(400).send('invalid abscence id.');

    const student = await Student.findById(req.params.studentId);
    if (!student) return res.status(404).send('student not found.');
    let abscence = student.abscences.find(a => a._id == req.params.abscenceId);
    if (!abscence) return res.status(404).send('abscence not found.');

    const { error } = validateAbscence.validate(req.body);
    if (error) return res.status(400).send(error.message);

    const _class = await Class.findOne({ 'sessions._id': req.body.session });
    if (!_class) return res.status(404).send('session not found.');
    const session = _class.sessions.find(s => s._id == req.body.session);

    abscence = student.abscences.find(a => a.session._id == req.body.session && a._id != req.params.abscenceId);
    if(abscence) return res.status(400).send('session abscence registred.');

    student.abscences = student.abscences.map(a => {
        if(a._id == req.params.abscenceId)
            return {
                session: {
                    _id: session._id,
                    subjectName: session.subject.Name,
                    weekDay: session.weekDay,
                    startTime: session.startTime,
                },
                _id: a._id,
                date: new Date().toISOString()
            }
        return  a;
    });

    await Student.findByIdAndUpdate(req.params.studentId, student);
    res.send(student.abscences);

});

router.delete('/:studentId/abscence/:abscenceId', async (req, res) => {
    let idStatus = mongoose.Types.ObjectId.isValid(req.params.studentId);
    if (!idStatus) return res.status(400).send('invalid student id.');
    idStatus = mongoose.Types.ObjectId.isValid(req.params.abscenceId);
    if (!idStatus) return res.status(400).send('invalid abscence id.');

    const student = await Student.findById(req.params.studentId);
    if (!student) return res.status(404).send('student not found.');
    let abscence = student.abscences.find(a => a._id == req.params.abscenceId);
    if (!abscence) return res.status(404).send('abscence not found.');

    student.abscences = student.abscences.filter(a => a._id != req.params.abscenceId);
    await Student.findByIdAndUpdate(req.params.studentId, student);
    res.send(student.abscences);
});

module.exports = router;