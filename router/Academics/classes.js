const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { Class, validateClass } = require('../../models/formations/class');
const { Student } = require('../../models/academics/student');

router.get('/', async (req, res) => {
    res.send(await Class.find());
});

router.get('/:id', async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send('invalid id.');

    const _class = await Class.findById(req.params.id);
    if (!_class) return res.status(404).send('invalid class.');

    res.send(await Class.findById(_class));
});

router.post('/', async (req, res) => {
    const { error } = validateClass.validate(req.body);
    if (error) return res.status(400).send(error.message);

    let student;
    for (let i = 0; i < req.body.students.length; i++) {
        student = await Student.findById(req.body.students[i]);
        if (!student) return res.status(400).send('invalid student in the list.');
    }

    const _class = new Class({
        Name: req.body.Name,
        nOfStudents: req.body.students.length,
        Teacher: req.body.Teacher,
        students: req.body.students
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

    let student;
    for (let i = 0; i < req.body.students.length; i++) {
        student = await Student.findById(req.body.students[i]);
        if (!student) return res.status(400).send('invalid student in the list.');
    }

    _class = await Class.findByIdAndUpdate(req.params.id, {
        Name: req.body.Name,
        nOfStudents: req.body.students.length,
        Teacher: req.body.Teacher,
        students: req.body.students
    }, {
        new: true
    });

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