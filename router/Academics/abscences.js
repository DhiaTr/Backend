const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { Abscence, validateAbscence } = require('../../models/academics/abscence');
const { Student } = require('../../models/academics/student');

// router.get('/', async (req, res) => {
//     res.send(await Abscence.find());
// });
//
// router.get('/:id', async (req, res) => {
//     const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
//     if (!idStatus) return res.status(400).send('invalid id.');
//
//     const abscence = await Abscence.findById(req.params.id);
//     if (!abscence) return res.status(404).send('invalid Abscence.');
//
//     res.send(abscence);
// });
//
// router.post('/', async (req, res) => {
//     const { error } = validateAbscence.validate(req.body);
//     if (error) return res.status(400).send(error.message);
//
//     const student = await Student.findById(req.body.student);
//     if (!student) return res.status(400).send('invalid student.');
//
//     const session = await Session.findById(req.body.session);
//     if (!session) return res.status(400).send('invalid session');
//
//     const abscence = new Abscence({
//         student: req.body.student,
//         session: req.body.session
//     });
//
//     res.send(await abscence.save())
// });
//
// router.put('/:id', async (req, res) => {
//     const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
//     if (!idStatus) return res.status(400).send('invalid id.');
//
//     let abscence = await Abscence.findById(req.params.id);
//     if (!abscence) return res.status(404).send('invalid Abscence.');
//
//     const { error } = validateAbscence.validate(req.body);
//     if (error) return res.status(400).send(error.message);
//
//     const student = await Student.findById(req.body.student);
//     if (!student) return res.status(400).send('invalid student.');
//
//     const session = await Session.findById(req.body.session);
//     if (!session) return res.status(400).send('invalid session');
//
//     abscence = await Abscence.findByIdAndUpdate(req.params.id, {
//         student: req.body.student,
//         session: req.body.session
//     }, {
//         new: true
//     });
//     res.send(abscence);
// });
//
// router.delete('/:id', async (req, res) => {
//     const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
//     if (!idStatus) return res.status(400).send('invalid id.');
//
//     const abscence = await Abscence.findById(req.params.id);
//     if (!abscence) return res.status(404).send('invalid Abscence.');
//
//     await Abscence.findByIdAndDelete(req.params.id);
//     res.send(abscence);
// });



module.exports = router;