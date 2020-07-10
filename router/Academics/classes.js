const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { Class, validateClass } = require('../../models/academics/class');
const { Student } = require('../../models/academics/student');
const { Formation } = require('../../models/academics/formation');

router.get('/', async (req, res) => {
    res.send(await Class.find().populate('formation'));
});

router.get('/:id', async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send('invalid id.');

    const _class = await Class.findById(req.params.id);
    if (!_class) return res.status(404).send('invalid class.');

    res.send(await Class.findById(_class).populate('students'));
});

router.get('/:id/students/', async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send('invalid id.');

    const _class = await Class.findById(req.params.id).populate('students');
    if (!_class) return res.status(404).send('invalid class.');

    res.send(_class.students);
});

// to be used while bulk adding students
router.get('/:id/studentsNotInClass/', async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send('invalid id.');

    const _class = await Class.findById(req.params.id);
    if (!_class) return res.status(404).send('invalid class.');

    const students = await Student.find();
    let result = [];
    for (let i = 0; i < students.length; i++) {
        id = students[i]._id;
        if (!_class.students.includes(id))
            result.push(students[i]);
    }
    res.send(result);
});

router.post('/', async (req, res) => {
    const { error } = validateClass.validate(req.body);
    if (error) return res.status(400).send(error.message);

    let _class = await Class.findOne({ Name: req.body.Name });
    if (_class) return res.status(400).send('class already existant.');

    const formation = await Formation.findById(req.body.formation);
    if (!formation) return res.status(400).send('invalid formation.');

    _class = new Class({
        Name: req.body.Name,
        formation: req.body.formation
        // Teacher: req.body.Teacher,
    });

    res.send(await _class.save())
});

router.put('/:id', async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send('invalid id.');

    let _class = await Class.findById(req.params.id);
    if (!_class) return res.status(404).send('invalid class.');

    const { error } = validateClass.validate(req.body);
    if (error) return res.status(400).send(error.message);

    _class = await Class.findOne({ Name: req.body.Name });
    if (_class) return res.status(400).send('class already existant.');

    const formation = await Formation.findById(req.body.formation);
    if (!formation) return res.status(400).send('invalid formation.');

    _class = await Class.findByIdAndUpdate(req.params.id, {
        Name: req.body.Name,
        formation: req.body.formation
        // Teacher: req.body.Teacher,
    }, {
        new: true
    });

    res.send(_class);
});

router.put('/:classId/addStudent/:studentId', async (req, res) => {
    let idStatus = mongoose.Types.ObjectId.isValid(req.params.classId);
    if (!idStatus) return res.status(400).send('invalid class id.');
    idStatus = mongoose.Types.ObjectId.isValid(req.params.studentId);
    if (!idStatus) return res.status(400).send('invalid student id.');

    let _class = await Class.findById(req.params.classId);
    if (!_class) return res.status(404).send('invalid class.');
    let student = await Student.findById(req.params.studentId);
    if (!student) return res.status(404).send('invalid Student.');

    student = _class.students.find(s => s == req.params.studentId);
    if (student) return res.status(404).send('student already registred in class');

    _class.students.push(req.params.studentId);

    _class = await Class.findByIdAndUpdate(req.params.classId, {
        students: _class.students
    }, {
        new: true
    })

    res.send(_class);
});

router.put('/:classId/removeStudent/:studentId', async (req, res) => {
    let idStatus = mongoose.Types.ObjectId.isValid(req.params.classId);
    if (!idStatus) return res.status(400).send('invalid class id.');
    idStatus = mongoose.Types.ObjectId.isValid(req.params.studentId);
    if (!idStatus) return res.status(400).send('invalid student id.');

    let _class = await Class.findById(req.params.classId);
    if (!_class) return res.status(404).send('invalid class.');
    let student = await Student.findById(req.params.studentId);
    if (!student) return res.status(404).send('invalid Student.');

    student = _class.students.find(s => s == req.params.studentId);
    if (!student) return res.status(404).send('student not registred in requsted class');

    _class.students = _class.students.filter(s => s != req.params.studentId);
    _class = await Class.findByIdAndUpdate(req.params.classId, _class, { new: true });

    res.send(_class);
});

router.delete('/:id', async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send('invalid id.');

    let _class = await Class.findById(req.params.id);
    if (!_class) return res.status(404).send('invalid class.');

    await Class.findByIdAndDelete(req.params.id);
    res.send(_class);
});


module.exports = router;