const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/formations/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '') + file.originalname);
    }
});

const upload = multer({ storage: storage });

const { Formation, validateFormation, validateSubject } = require('../../models/academics/formation');
const { Page } = require('../../models/frontCms/page');


router.get('/', async (req, res) => {
    res.send(await Formation.find());
});


router.get('/:id', async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send('invalid id.');

    const formation = await Formation.findById(req.params.id);
    if (!formation) return res.status(404).send('invalid formation.');

    res.send(formation);
});

router.get('/:formationId/subject/:subjectId', async (req, res) => {
    let idStatus = mongoose.Types.ObjectId.isValid(req.params.formationId);
    if (!idStatus) return res.status(400).send('invalid formation id.');
    idStatus = mongoose.Types.ObjectId.isValid(req.params.subjectId);
    if (!idStatus) return res.status(400).send('invalid subject id.');

    let formation = await Formation.findById(req.params.formationId);
    if (!formation) return res.status(404).send('formation not found.');
    const subject = formation.subjects.find(s => s._id == req.params.subjectId);
    if (!subject) return res.status(400).send('subject not found!');

    res.send(subject);
});

router.post('/', upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).send('no image selected.');

    const { error } = validateFormation.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const formation = new Formation({
        Name: req.body.Name,
        Description: req.body.Description,
        image: req.file.path,
        durationInMonths: req.body.durationInMonths,
        Price: req.body.Price,
        nOfLectures: req.body.nOfLectures,
        subjects: []
    });
    res.send(await formation.save());
});

router.put('/:id', upload.single('image'), async (req, res) => {

    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send('invalid id.');

    let formation = await Formation.findById(req.params.id);
    if (!formation) return res.status(404).send('formation not found.');

    const { error } = validateFormation.validate(req.body);
    if (error) return res.status(400).send(error.message);

    formation = {
        Name: req.body.Name,
        Description: req.body.Description,
        durationInMonths: req.body.durationInMonths,
        Price: req.body.Price,
        nOfLectures: req.body.nOfLectures
    }

    if (req.file) formation.image = req.file.path;

    formation = await Formation.findByIdAndUpdate(req.params.id, formation, {
        new: true
    });

    let pages = await Page.find({ 'formations._id': req.params.id });
    pages.forEach(async (page) => {
        let formations = page.formations.map(f => {
            if (f._id == req.params.id) {
                return {
                    _id: f._id,
                    Name: formation.Name,
                    Description: formation.Description,
                    Price: formation.Price,
                    durationInMonths: formation.durationInMonths,
                    image: formation.image
                };
            } else return f;
        });
        newPage = {
            _id: page._id,
            Name: page.Name,
            Description: page.Description,
            formations: formations
        }

        await Page.findByIdAndUpdate(page._id, newPage);
    });

    res.send(formation);
});

router.put('/:id/addSubject', async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send('invalid id.');

    let formation = await Formation.findById(req.params.id);
    if (!formation) return res.status(404).send('formation not found.');

    const { error } = validateSubject.validate(req.body);
    if (error) return res.status(400).send(error.message);

    subject = formation.subjects.find(s => s.Name == req.body.Name);
    if (subject) return res.status(400).send('subject exists already');

    formation.subjects.push(req.body);
    formation = await Formation.findByIdAndUpdate(req.params.id, {
        subjects: formation.subjects
    }, { new: true });

    res.send(formation);
});

router.put('/:formationId/updateSubject/:subjectId', async (req, res) => {
    let idStatus = mongoose.Types.ObjectId.isValid(req.params.formationId);
    if (!idStatus) return res.status(400).send('invalid formation id.');
    idStatus = mongoose.Types.ObjectId.isValid(req.params.subjectId);
    if (!idStatus) return res.status(400).send('invalid subject id.');

    let formation = await Formation.findById(req.params.formationId);
    if (!formation) return res.status(404).send('formation not found.');
    const subject = formation.subjects.find(s => s._id == req.params.subjectId);
    if (!subject) return res.status(400).send('subject not found!');

    const { error } = validateSubject.validate(req.body);
    if (error) return res.status(400).send(error.message);

    formation.subjects = formation.subjects.map(s => {
        if (s._id == req.params.subjectId)
            return {
                _id: s._id,
                Name: req.body.Name,
                Description: req.body.Description
            }
        return s;
    });
    formation = await Formation.findByIdAndUpdate(req.params.formationId, {
        subjects: formation.subjects
    }, { new: true });

    res.send(formation);
});

router.put('/:formationId/deleteSubject/:subjectId', async (req, res) => {
    let idStatus = mongoose.Types.ObjectId.isValid(req.params.formationId);
    if (!idStatus) return res.status(400).send('invalid formation id.');
    idStatus = mongoose.Types.ObjectId.isValid(req.params.subjectId);
    if (!idStatus) return res.status(400).send('invalid subject id.');

    let formation = await Formation.findById(req.params.formationId);
    if (!formation) return res.status(404).send('formation not found.');
    const subject = formation.subjects.find(s => s._id == req.params.subjectId);
    if (!subject) return res.status(400).send('subject not found!');

    formation.subjects = formation.subjects.filter(s => s._id != req.params.subjectId);
    formation = await Formation.findByIdAndUpdate(req.params.formationId, {
        subjects: formation.subjects
    }, { new: true });

    res.send(formation);
});

router.delete('/:id', async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send('invalid id.');

    const formation = await Formation.findById(req.params.id);
    if (!formation) return res.status(404).send('formation not found.');

    let pages = await Page.find({ 'formations._id': req.params.id });
    pages.forEach(async (page) => {
        let formations = page.formations.filter(f => f._id != req.params.id);
        newPage = {
            Name: page.Name,
            Description: page.Description,
            formations: formations
        }
        await Page.findByIdAndUpdate(page._id, newPage);
    });
    await Formation.findByIdAndDelete(req.params.id);
    res.send(formation);
});

module.exports = router;