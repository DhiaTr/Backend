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
const upload = multer({ storage: storage });
const { Media } = require('../../models/frontCms/media');


router.get('/', async (req, res) => {
    res.send(await Media.find());
});

router.get('/:id', async (req, res) => {
    res.send(await Media.find({ _id: id }));
});

router.post('/', upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).send('no image selected.');
    const media = new Media({ path: req.file.path });
    res.send(await media.save());
});

router.delete('/:id', async (req, res) => {
    const media = await Media.findByIdAndDelete(req.params.id);
    res.send(media);
});



module.exports = router;