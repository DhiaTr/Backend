const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '') + file.originalname);
    }
});
// add more validation
const upload = multer({ storage: storage });
const { Media } = require('../../models/frontCms/media');


router.get('/', async (req, res) => {
    res.send(await Media.find());
});

router.post('/', upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).send('no image selected.');
    const media = new Media({ path: req.file.path });
    res.send(await media.save());
});

router.delete('/:id', async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send('invalid id.');

    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).send('media not found.');

    await Media.findByIdAndDelete(req.params.id);
    res.send(media);
    // make file deletion permenant qm
});



module.exports = router;