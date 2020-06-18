const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const { Employee, validateEmployee } = require("../../models/academics/employee");
const { Entreprise } = require("../../models/academics/Entreprise");
const { User } = require('../../models/auth/user');

const auth = require("../../middlewares/Auth");

router.get("/", auth, async (req, res) => {
    res.send(await Employee.find());
});

router.get("/:id", auth, async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send("invalid id.");

    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).send("employee not found.");

    res.send(employee);
});

router.post("/", auth, async (req, res) => {
    const { error } = validateEmployee.validate(req.body);
    if (error) return res.status(400).send(error.message);

    MailCheck = await User.findOne({ Email: req.body.Email });
    if (MailCheck) return res.status(400).send('user with the given mail already existant');

    const entreprise = await Entreprise.findById(req.body.Entreprise);
    if (!entreprise) return res.status(400).send("invalid Entreprise.");

    const employee = new Employee({
        Name: req.body.Name,
        phone: req.body.phone,
        Email: req.body.Email,
        Address: req.body.Address,
        Entreprise: req.body.Entreprise,
    });

    const user = new User({
        Email: req.body.Email,
        Role: 'employee'
    });

    const salt = await bcrypt.genSalt(10);
    employee.password = user.password = await bcrypt.hash(req.body.password, salt);

    await user.save();
    await employee.save();

    res.send(employee);
});

router.put("/:id", auth, async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send("invalid id.");

    let employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).send("Employee not found.");

    let user = await User.findOne({ Email: employee.Email });
    if (!user) user = await new User({ Email: employee.Email, Role: 'employee', password: employee.password }).save();

    const { error } = validateEmployee.validate(req.body);
    if (error) return res.status(400).send(error.message);

    const entreprise = await Entreprise.findById(req.body.Entreprise);
    if (!entreprise) return res.status(400).send("invalid Entreprise.");

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

    user = await User.findByIdAndUpdate(user._id, {
        Email: req.body.Email,
        Role: 'employee',
        password: password
    });

    res.send(employee);
});

router.delete("/:id", auth, async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send("invalid id.");

    let employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).send("employee not found.");

    const user = await User.findOne({ Email: employee.Email });
    if (user) await User.findByIdAndDelete(user._id);

    employee = await Employee.findByIdAndDelete(req.params.id);
    res.send(employee);
});

module.exports = router;
