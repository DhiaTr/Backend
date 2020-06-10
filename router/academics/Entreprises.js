const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const { Entreprise, validateEntreprise } = require("../../models/academics/Entreprise");
const { User } = require('../../models/auth/user');

const auth = require("../../middlewares/Auth");

router.get("/", auth, async (req, res) => {
    res.send(await Entreprise.find());
});

router.get("/:id", auth, async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send("invalid id.");

    const entreprise = await Entreprise.findById(req.params.id);
    if (!entreprise) return res.status(404).send("Entreprise not found.");

    res.send(entreprise);
});

router.post("/", auth, async (req, res) => {
    const { error } = validateEntreprise.validate(req.body);
    if (error) return res.status(400).send(error.message);

    MailCheck = await User.findOne({ Email: req.body.Email });
    if (MailCheck) return res.status(400).send(' user with the given mail already existant');

    const entreprise = new Entreprise({
        Name: req.body.Name,
        phone: req.body.phone,
        Email: req.body.Email,
        Address: req.body.Address,
        employees: req.body.employees,
    });

    const user = new User({
        Email: req.body.Email,
        Role: 'entreprise'
    });
    const salt = await bcrypt.genSalt(10);
    entreprise.password = user.password = await bcrypt.hash(req.body.password, salt);

    await user.save();
    await entreprise.save();

    res.send(entreprise);
});

router.put("/:id", auth, async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send("invalid id.");

    let entreprise = await Entreprise.findById(req.params.id);
    if (!entreprise) return res.status(404).send("entreprise not found.");

    let user = await User.findOne({ Email: entreprise.Email });
    if (!user) user = await new User({ Email: entreprise.Email, Role: 'entreprise', password: entreprise.password }).save();

    const { error } = validateEntreprise.validate(req.body);
    if (error) return res.status(400).send(error.message);

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    entreprise = await Entreprise.findByIdAndUpdate(
        req.params.id,
        {
            Name: req.body.Name,
            phone: req.body.phone,
            Email: req.body.Email,
            Address: req.body.Address,
            employees: req.body.employees,
            password: password
        },
        {
            new: true,
        }
    );

    user = await User.findByIdAndUpdate(user._id, {
        Email: req.body.Email,
        Role: 'entreprise',
        password: password
    });

    res.send(entreprise);
});

router.delete("/:id", auth, async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send("invalid id.");

    let entreprise = await Entreprise.findById(req.params.id);
    if (!entreprise) return res.status(404).send("entreprise not found.");

    const user = await User.findOne({ Email: entreprise.Email });
    if (user) await User.findByIdAndDelete(user._id);

    entreprise = await Entreprise.findByIdAndDelete(req.params.id);
    res.send(entreprise);
});

module.exports = router;
