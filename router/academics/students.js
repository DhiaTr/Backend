const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const { Student, validateStudent } = require("../../models/academics/student");
const { Guardian } = require("../../models/academics/guardian");

router.get("/", async (req, res) => {
  res.send(await Student.find());
});

router.get("/:id", async (req, res) => {
  const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!idStatus) return res.status(400).send("invalid id.");

  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).send("student not found.");

  res.send(student);
});

router.post("/", async (req, res) => {
  const { error } = validateStudent.validate(req.body);
  if (error) return res.status(400).send(error.message);

  const guardian = await Guardian.findById(req.body.guardian);
  if (!guardian) return res.status(400).send("invalid guardian");

  let MailCheck = await Student.findOne({ Email: req.body.Email });
  if (MailCheck) return res.status(400).send('user with the given mail already existant');

  MailCheck = await Guardian.findOne({ Email: req.body.Email });
  if (MailCheck) return res.status(400).send(' user with the given mail already existant');

  const student = new Student({
    Name: req.body.Name,
    phone: req.body.phone,
    BirthDate: req.body.BirthDate,
    Email: req.body.Email,
    Address: req.body.Address,
    Gender: req.body.Gender,
    guardian: req.body.guardian,
  });
  const salt = await bcrypt.genSalt(10);
  student.password = await bcrypt.hash(req.body.password, salt);
  const token = student.generateAuthToken();

  res.header('x-auth-token', token).send(await student.save());
});

router.put("/:id", async (req, res) => {
  const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!idStatus) return res.status(400).send("invalid id.");

  let student = await Student.findById(req.params.id);
  if (!student) return res.status(404).send("student not found.");

  const { error } = validateStudent.validate(req.body);
  if (error) return res.status(400).send(error.message);

  const guardian = await Guardian.findById(req.body.guardian);
  if (!guardian) return res.status(400).send("invalid guardian");

  let MailCheck = await Student.findOne({ Email: req.body.Email });
  if (MailCheck) return res.status(400).send('user with the given mail already existant');

  MailCheck = await Guardian.findOne({ Email: req.body.Email });
  if (MailCheck) return res.status(400).send(' user with the given mail already existant');

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  student = await Student.findByIdAndUpdate(
    req.params.id,
    {
      Name: req.body.Name,
      phone: req.body.phone,
      BirthDate: req.body.BirthDate,
      Email: req.body.Email,
      Address: req.body.Address,
      Gender: req.body.Gender,
      guardian: req.body.guardian,
      password: password
    },
    {
      new: true,
    }
  );

  res.send(student);
});

router.delete("/:id", async (req, res) => {
  const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!idStatus) return res.status(400).send("invalid id.");

  let student = await Student.findById(req.params.id);
  if (!student) return res.status(404).send("student not found.");

  student = await Student.findByIdAndDelete(req.params.id);
  res.send(student);
});

module.exports = router;
