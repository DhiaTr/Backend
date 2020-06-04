const express = require('express');
const router = express.Router();

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});


const upload = multer({ storage: storage });


const { Media } = require('../models/media');


router.get('/', async (req, res) => {
    res.send(await Media.find());
});

router.get('/id', async (req, res) => {
    res.send(await Media.find({ _id: id }));
});

router.post('/', upload.single('image'), async (req, res) => {
    // const media = new Media({ path: req.file.path });
    // res.send(await media.save());
    res.send('1');
});



module.exports = router;