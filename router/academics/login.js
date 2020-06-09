const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Joi = require("@hapi/joi");

const { Student } = require('../../models/academics/student');
const { Guardian } = require('../../models/academics/guardian');


const validateAuth = Joi.object({
    Email: Joi.string().min(10).max(150).required(),
    password: Joi.string().min(5).max(200).required()
});

router.post('/', async (req, res) => {

    const { error } = validateAuth.validate(req.body);
    if (error) return res.status(400).send(error.message);

    const student = await Student.findOne({ Email: req.body.Email });
    const guardian = await Guardian.findOne({ Email: req.body.Email });
    if (!guardian && !student) return res.status(400).send('Invalid email or password');

    let validate = '';
    if (guardian) {
        console.log(guardian);
        console.log(req.body.password);
        console.log(guardian.password);
        validate = await bcrypt.compare(req.body.password, guardian.password);
    }
    else if (student) {
        console.log(student);
        console.log(req.body.password);
        console.log(student.password);
        validate = await bcrypt.compare(req.body.password, student.password);
    }

    if (!validate) return res.status(400).send('invalid email or password');

    let token = '';
    if (guardian) token = guardian.generateAuthToken();
    else if (student) token = student.generateAuthToken();

    res.send({ token });
});

module.exports = router;