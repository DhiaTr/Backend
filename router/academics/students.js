const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

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

  const student = new Student({
    Name: req.body.Name,
    phone: req.body.phone,
    BirthDate: req.body.BirthDate,
    Email: req.body.Email,
    Address: req.body.Address,
    Gender: req.body.Gender,
    guardian: req.body.guardian,
  });

  res.send(await student.save());
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
// in post check if student already exists through mail and age?
