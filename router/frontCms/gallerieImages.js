const express = require('express');
const router = express.Router();

const { GalleryImage } = require('../../models/frontCms/galleryImg');
const { Media } = require('../../models/frontCms/media');

router.get('/', async (req, res) => {
    res.send(await GalleryImage.find());
});

router.post('/', async (req, res) => {
    const image = await Media.findById(req.body.img);
    if (!image) return res.status(400).send('image wasnt found');

    const galleryImage = new GalleryImage({
        img: { _id: image._id, path: image.path }
    });

    res.send(await galleryImage.save())
})




module.exports = router;