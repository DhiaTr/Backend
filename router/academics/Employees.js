const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const { Employee, validateEmployee } = require("../../models/academics/employee");
const { Entreprise } = require("../../models/academics/Entreprise");

router.get("/", async (req, res) => {
    res.send(await Employee.find());
});

router.get("/:id", async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send("invalid id.");

    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).send("employee not found.");

    res.send(employee);
});

router.post("/", async (req, res) => {
    const { error } = validateEmployee.validate(req.body);
    if (error) return res.status(400).send(error.message);

    // let MailCheck = await Student.findOne({ Email: req.body.Email });
    // if (MailCheck) return res.status(400).send('user with the given mail already existant');

    // MailCheck = await Guardian.findOne({ Email: req.body.Email });
    // if (MailCheck) return res.status(400).send(' user with the given mail already existant');

    // turn those into a middleware

    const entreprise = await Entreprise.findById(req.body.Entreprise);
    if (!entreprise) return res.status(400).send("invalid Entreprise.");

    let employee = new Employee({
        Name: req.body.Name,
        phone: req.body.phone,
        Email: req.body.Email,
        Address: req.body.Address,
        Entreprise: req.body.Entreprise,
    });
    const salt = await bcrypt.genSalt(10);
    employee.password = await bcrypt.hash(req.body.password, salt);
    const token = employee.generateAuthToken();

    res.header('x-auth-token', token).send(await employee.save());


    res.send(await employee.save());
});

router.put("/:id", async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send("invalid id.");

    let employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).send("Employee not found.");

    const { error } = validateEmployee.validate(req.body);
    if (error) return res.status(400).send(error.message);

    const entreprise = await Entreprise.findById(req.body.Entreprise);
    if (!entreprise) return res.status(400).send("invalid Entreprise.");

    // let MailCheck = await Student.findOne({ Email: req.body.Email });
    // if (MailCheck) return res.status(400).send('user with the given mail already existant');

    // MailCheck = await Guardian.findOne({ Email: req.body.Email });
    // if (MailCheck) return res.status(400).send(' user with the given mail already existant');


    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    employee = await Employee.findByIdAndUpdate(
        req.params.id,
        {
            Name: req.body.Name,
            phone: req.body.phone,
            Email: req.body.Email,
            Address: req.body.Address,
            Entreprise: req.body.Entreprise,
            password: password
        },
        {
            new: true,
        }
    );

    res.send(employee);
});

router.delete("/:id", async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send("invalid id.");

    let employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).send("employee not found.");

    employee = await Employee.findByIdAndDelete(req.params.id);
    res.send(employee);
});

module.exports = router;
