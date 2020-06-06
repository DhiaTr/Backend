const express = require('express');
const router = express.Router();

const { ContactInFo, validateContactInfo } = require('../../models/frontCms/contactInfo');

router.get('/', async (req, res) => {
    res.send(await ContactInFo.findOne());
});

router.put('/', async (req, res) => {
    const { error } = validateContactInfo().validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

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