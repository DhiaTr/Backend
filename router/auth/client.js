const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const { User, validateUser } = require('../../models/auth/user');




router.post('/', async (req, res) => {

    const { error } = validateUser.validate(req.body);
    if (error) return res.status(400).send(error.message);

    const user = await User.findOne({ Email: req.body.Email });
    if (!user) return res.status(401).send('invalid email or password.');


    const validate = await bcrypt.compare(req.body.password, user.password);
    if (!validate) return res.status(400).send('invalid email or password');

    const token = user.generateAuthToken();

    res.send({ token });
});

module.exports = router;