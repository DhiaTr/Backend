const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { Guardian, validateGuardian } = require("../../models/academics/guardian");
const { Student } = require("../../models/academics/student");

router.get("/", async (req, res) => {
  res.send(await Guardian.find());
});

router.get("/:id", async (req, res) => {
  const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!idStatus) return res.status(400).send("invalid id.");

  const guardian = await Guardian.findById(req.params.id);
  if (!guardian) return res.status(404).send("guardian not found.");

  res.send(guardian);
});

router.post("/", async (req, res) => {
  const { error } = validateGuardian.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let MailCheck = await Student.findOne({ Email: req.body.Email });
  if (MailCheck) return res.status(400).send('user with the given mail already existant');

  MailCheck = await Guardian.findOne({ Email: req.body.Email });
  if (MailCheck) return res.status(400).send(' user with the given mail already existant');

  const guardian = new Guardian({
    Name: req.body.Name,
    phone: req.body.phone,
    Occupation: req.body.Occupation,
    Email: req.body.Email,
    Address: req.body.Address,
    GuardianRelation: req.body.GuardianRelation,
  });

  res.send(await guardian.save());
});

// add password in post and put 

router.put("/:id", async (req, res) => {
  const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!idStatus) return res.status(400).send("invalid id.");

  let guardian = await Guardian.findById(req.params.id);
  if (!guardian) return res.status(404).send("guardian not found.");

  const { error } = validateGuardian.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let MailCheck = await Student.findOne({ Email: req.body.Email });
  if (MailCheck) return res.status(400).send('user with the given mail already existant');

  MailCheck = await Guardian.findOne({ Email: req.body.Email });
  if (MailCheck) return res.status(400).send(' user with the given mail already existant');

  guardian = await Guardian.findByIdAndUpdate(
    req.params.id,
    {
      Name: req.body.Name,
      phone: req.body.phone,
      Occupation: req.body.Occupation,
      Email: req.body.Email,
      Address: req.body.Address,
      GuardianRelation: req.body.GuardianRelation,
    },
    {
      new: true,
    }
  );

  res.send(guardian);
});

router.delete("/:id", async (req, res) => {
  const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!idStatus) return res.status(400).send("invalid id.");

  let guardian = await Guardian.findById(req.params.id);
  if (!guardian) return res.status(404).send("guardian not found.");

  guardian = await Guardian.findByIdAndDelete(req.params.id);
  res.send(guardian);
});

module.exports = router;
