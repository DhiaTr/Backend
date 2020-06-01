const express = require('express');
const router = express.Router();

const { ContactInFo } = require('../models/contactInfo');

router.get('/', async (req, res) => {
    res.send(await ContactInFo.findOne());
});

router.put('/', async (req, res) => {
    await ContactInFo.deleteOne();
    const contactInfo = new ContactInFo({
        phone1: req.body.phone1,
        phone2: req.body.phone2,
        address: req.body.address,
        email: req.body.email,
        FacebookURL: req.body.FacebookURL,
        TwitterURL: req.body.TwitterURL,
        InstagramURL: req.body.InstagramURL,
        LinkedinURL: req.body.LinkedinURL
    });
    res.send(await contactInfo.save());
});

module.exports = router;