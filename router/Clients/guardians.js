const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const { Guardian, validateGuardian } = require("../../models/academics/guardian");
const { Student } = require("../../models/academics/student");
const { User } = require('../../models/auth/user');

const auth = require("../../middlewares/Auth");

router.get("/", auth, async (req, res) => {
  res.send(await Guardian.find());
});

router.get("/:id", auth, async (req, res) => {
  const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!idStatus) return res.status(400).send("invalid id.");

  const guardian = await Guardian.findById(req.params.id);
  if (!guardian) return res.status(404).send("guardian not found.");

  res.send(guardian);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateGuardian.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let MailCheck = await User.findOne({ Email: req.body.Email });
  if (MailCheck) return res.status(400).send('user with the given mail already existant');

  let CINCheck = await Guardian.findOne({ CIN: req.body.CIN });
  if (CINCheck) return res.status(400).send('user with the given CIN already existant');

  for (let i = 0; i < req.body.Parish.length; i++) {
    let student = await Student.findById(req.body.Parish[i].studentId);
    if (!student) return res.status(400).send('invalid student id');
  }

  const guardian = new Guardian({
    CIN: req.body.CIN,
    Name: req.body.Name,
    phone: req.body.phone,
    Occupation: req.body.Occupation,
    Email: req.body.Email,
    Address: req.body.Address,
    Parish: req.body.Parish,
  });

  const user = new User({
    Email: req.body.Email,
    Role: 'guardian'
  });

  const salt = await bcrypt.genSalt(10);
  guardian.password = user.password = await bcrypt.hash(req.body.password, salt);

  await user.save();
  await guardian.save();

  res.send(guardian);
});

// test put and delete

// router.put("/:id", auth, async (req, res) => {
//   const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
//   if (!idStatus) return res.status(400).send("invalid id.");

//   let guardian = await Guardian.findById(req.params.id);
//   if (!guardian) return res.status(404).send("guardian not found.");

//   let user = await User.findOne({ Email: guardian.Email });
//   if (!user) user = await new User({ Email: guardian.Email, Role: 'guardian', password: guardian.password }).save();

//   const { error } = validateGuardian.validate(req.body);
//   if (error) return res.status(400).send(error.details[0].message);


// let CINCheck = await Guardian.findOne({ CIN: req.body.CIN });
// if (CINCheck) return res.status(400).send('user with the given CIN already existant');

// for (let i = 0; i < req.body.Parish.length; i++) {
//   let student = await Student.findById(req.body.Parish[i].studentId);
//   if (!student) return res.status(400).send('invalid student id');
// }
//   const salt = await bcrypt.genSalt(10);
//   const password = await bcrypt.hash(req.body.password, salt);

//   guardian = await Guardian.findByIdAndUpdate(
//     req.params.id,
//     {
// CIN: req.body.CIN,
//       Name: req.body.Name,
//       phone: req.body.phone,
//       Occupation: req.body.Occupation,
//       Email: req.body.Email,
//       Address: req.body.Address,
//       Parish: req.body.Parish,
//       password: password
//     },
//     {
//       new: true,
//     }
//   );

//   user = await User.findByIdAndUpdate(user._id, {
//     Email: req.body.Email,
//     Role: 'guardian',
//     password: password
//   });

//   await user.save();
//   await guardian.save();

//   res.send(guardian);
// });

// router.delete("/:id", auth, async (req, res) => {
//   const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
//   if (!idStatus) return res.status(400).send("invalid id.");

//   let guardian = await Guardian.findById(req.params.id);
//   if (!guardian) return res.status(404).send("guardian not found.");

//   const user = await User.findOne({ Email: guardian.Email });
//   if (user) await User.findByIdAndDelete(user._id);

//   guardian = await Guardian.findByIdAndDelete(req.params.id);
//   res.send(guardian);
// });

module.exports = router;
