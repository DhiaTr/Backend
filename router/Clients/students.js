const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const { Student, validateStudent } = require("../../models/academics/student");
const { Guardian } = require("../../models/academics/guardian");
const { User } = require('../../models/auth/user');

const auth = require("../../middlewares/Auth");

router.get("/", auth, async (req, res) => {
  res.send(await Student.find());
});

router.get("/:id", auth, async (req, res) => {
  const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!idStatus) return res.status(400).send("invalid id.");

  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).send("student not found.");

  res.send(student);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateStudent.validate(req.body);
  if (error) return res.status(400).send(error.message);

  const guardian = await Guardian.findById(req.body.guardian);
  if (!guardian) return res.status(400).send("invalid guardian");

  const MailCheck = await User.findOne({ Email: req.body.Email });
  if (MailCheck) return res.status(400).send('user with the given mail already existant');

  const student = new Student({
    Name: req.body.Name,
    phone: req.body.phone,
    BirthDate: req.body.BirthDate,
    Email: req.body.Email,
    Address: req.body.Address,
    Gender: req.body.Gender,
    guardian: req.body.guardian,
  });

  const user = new User({
    Email: req.body.Email,
    Role: 'student'
  });
  const salt = await bcrypt.genSalt(10);
  user.password = student.password = await bcrypt.hash(req.body.password, salt);

  await user.save();
  await student.save();

  res.send(student);
});

router.put("/:id", auth, async (req, res) => {
  const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!idStatus) return res.status(400).send("invalid id.");

  let student = await Student.findById(req.params.id);
  if (!student) return res.status(404).send("student not found.");

  let user = await User.findOne({ Email: student.Email });
  if (!user) user = await new User({ Email: student.Email, Role: 'student', password: student.password }).save();

  const { error } = validateStudent.validate(req.body);
  if (error) return res.status(400).send(error.message);

  const guardian = await Guardian.findById(req.body.guardian);
  if (!guardian) return res.status(400).send("invalid guardian");

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

  await User.findByIdAndUpdate(user._id, {
    Email: student.Email,
    Role: 'student',
    password: student.password
  })

  res.send(student);
});

router.delete("/:id", auth, async (req, res) => {
  const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!idStatus) return res.status(400).send("invalid id.");

  let student = await Student.findById(req.params.id);
  if (!student) return res.status(404).send("student not found.");

  const user = await User.findOne({ Email: student.Email });
  if (user) await User.findByIdAndDelete(user._id);

  student = await Student.findByIdAndDelete(req.params.id);
  res.send(student);
});

module.exports = router;
