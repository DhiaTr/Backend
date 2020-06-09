const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const { Entreprise, validateEntreprise } = require("../../models/academics/Entreprise");

router.get("/", async (req, res) => {
    res.send(await Entreprise.find());
});

router.get("/:id", async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send("invalid id.");

    const entreprise = await Entreprise.findById(req.params.id);
    if (!entreprise) return res.status(404).send("Entreprise not found.");

    res.send(entreprise);
});

router.post("/", async (req, res) => {
    const { error } = validateEntreprise.validate(req.body);
    if (error) return res.status(400).send(error.message);

    // let MailCheck = await Student.findOne({ Email: req.body.Email });
    // if (MailCheck) return res.status(400).send('user with the given mail already existant');

    // MailCheck = await Guardian.findOne({ Email: req.body.Email });
    // if (MailCheck) return res.status(400).send(' user with the given mail already existant');

    // turn those into a middleware

    let entreprise = new Entreprise({
        Name: req.body.Name,
        phone: req.body.phone,
        Email: req.body.Email,
        Address: req.body.Address,
        employees: req.body.employees,
    });
    const salt = await bcrypt.genSalt(10);
    entreprise.password = await bcrypt.hash(req.body.password, salt);
    const token = entreprise.generateAuthToken();

    res.header('x-auth-token', token).send(await entreprise.save());


    res.send(await entreprise.save());
});

router.put("/:id", async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send("invalid id.");

    let entreprise = await Entreprise.findById(req.params.id);
    if (!entreprise) return res.status(404).send("entreprise not found.");

    const { error } = validateEntreprise.validate(req.body);
    if (error) return res.status(400).send(error.message);

    // let MailCheck = await Student.findOne({ Email: req.body.Email });
    // if (MailCheck) return res.status(400).send('user with the given mail already existant');

    // MailCheck = await Guardian.findOne({ Email: req.body.Email });
    // if (MailCheck) return res.status(400).send(' user with the given mail already existant');


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

    res.send(entreprise);
});

router.delete("/:id", async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send("invalid id.");

    let entreprise = await Entreprise.findById(req.params.id);
    if (!entreprise) return res.status(404).send("entreprise not found.");

    entreprise = await Entreprise.findByIdAndDelete(req.params.id);
    res.send(entreprise);
});

module.exports = router;
