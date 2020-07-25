const express = require("express");
const app = express();


app.use(express.json());
app.use("/uploads", express.static("uploads"));

require("./startup/db")();
require("./startup/config")();

const contactInfo = require("./router/frontCms/ContactInfo");
const menu = require("./router/frontCms/menus");
const media = require("./router/frontCms/media");
const gallerieImages = require("./router/frontCms/gallerieImages");
const pages = require("./router/frontCms/pages");
const events = require('./router/frontCms/events');

const formations = require("./router/Academics/formations");
const classes = require('./router/Academics/classes');
const subjects = require('./router/Academics/subjects');
const sessions = require('./router/Academics/sessions');
const exams = require('./router/Academics/exams');
const notes = require('./router/Academics/notes');
const abscences = require('./router/Academics/abscences');

const guardians = require("./router/Clients/guardians");
const students = require("./router/Clients/students");
const clientLogin = require("./router/auth/client");

const admins = require('./router/Human Ressources/admins');
const teachers = require('./router/Human Ressources/teachers');
const staffAuth = require('./router/auth/admins');


app.use("/api/contactInfo", contactInfo);
app.use("/api/menus", menu);
app.use("/api/media", media);
app.use("/api/gallerieImages", gallerieImages);
app.use("/api/pages", pages);
app.use('/api/events', events);

app.use("/api/formations", formations);
app.use('/api/classes', classes);
app.use('/api/subjects', subjects);
app.use('/api/sessions', sessions);
app.use('/api/exams', exams);
app.use('/api/notes', notes);
app.use('/api/abscences', abscences);

app.use("/api/guardians", guardians);
app.use("/api/students", students);
app.use("/api/auth", clientLogin);

app.use("/api/admins", admins);
app.use("/api/teachers", teachers);
app.use("/api/staffAuth", staffAuth);

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  console.log(`Listening on port ${port}...`)
);
module.exports = server;
