const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const { Staff, validateStaff } = require('../../models/auth/staff');


router.post('/', async (req, res) => {

    const { error } = validateStaff.validate(req.body);
    if (error) return res.status(400).send(error.message);

    const staff = await Staff.findOne({ Email: req.body.Email });
    if (!staff) return res.status(401).send('invalid email or password.');


    const validate = await bcrypt.compare(req.body.password, staff.password);
    if (!validate) return res.status(400).send('invalid email or password');

    const token = staff.generateAuthToken();

    res.send({ token });
});

module.exports = router;