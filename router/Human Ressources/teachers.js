const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const { Teacher, validateTeacher } = require('../../models/human Ressources/Teacher');
const { Staff } = require('../../models/auth/staff');

router.get('/', async (req, res) => {
    res.send(await Teacher.find());
});

router.get('/:id', async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send("invalid id.");

    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).send("teacher not found.");
    res.send(await Teacher.findById(req.params.id));
});

router.post('/', async (req, res) => {

    const { error } = validateTeacher.validate(req.body);
    if (error) return res.status(400).send(error.message);

    let teacher = await Teacher.findOne({ Email: req.body.Email });
    if (teacher) return res.status(400).send('Teacher already existant');

    teacher = new Teacher({
        Name: req.body.Name,
        phone: req.body.phone,
        Specialty: req.body.Specialty,
        Email: req.body.Email,
        Address: req.body.Address,
        Classes: req.body.Classes,
    });

    const staff = new Staff({
        Email: req.body.Email,
        Role: 'teacher'
    });

    const salt = await bcrypt.genSalt(10);
    teacher.password = staff.password = await bcrypt.hash(req.body.password, salt);

    await staff.save();
    await teacher.save();

    res.send(teacher);
});

router.put('/:id', async (req, res) => {

    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send("invalid id.");

    let teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).send("teacher not found.");

    let staff = await Staff.findOne({ Email: req.body.Email });
    if (!staff) staff = await new Staff({
        Email: teacher.Email,
        Role: 'teacher',
        password: teacher.password
    }).save();

    const { error } = validateTeacher.validate(req.body);
    if (error) return res.status(400).send(error.message);

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    teacher = await Teacher.findByIdAndUpdate(req.params.id, {
        Name: req.body.Name,
        phone: req.body.phone,
        Specialty: req.body.Specialty,
        Email: req.body.Email,
        Address: req.body.Address,
        Classes: req.body.Classes,
        password: password
    }, {
        new: true
    });
    staff = await Staff.findByIdAndUpdate(staff._id, {
        Email: teacher.Email,
        Role: 'teacher',
        password: password
    });
    res.send(teacher);
});

router.delete('/:id', async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send("invalid id.");

    let teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).send("teacher not found.");

    let staff = await Staff.findOne({ Email: req.body.Email });
    if (staff) await Staff.findByIdAndDelete(staff._id);

    teacher = await Teacher.findByIdAndDelete(req.params.id);
    res.send(teacher);
});




module.exports = router;