const express = require("express");
const app = express();


app.use("/uploads", express.static("uploads"));
app.use(express.json());

require("./startup/db")();
require("./startup/config")();

const contactInfo = require("./router/frontCms/ContactInfo");
const menu = require("./router/frontCms/menus");
const menuItems = require("./router/frontCms/menuItems");
const media = require("./router/frontCms/media");
const gallerieImages = require("./router/frontCms/gallerieImages");
const pages = require("./router/frontCms/pages");

const formations = require("./router/formations/formations");

const guardians = require("./router/academics/guardians");
const entreprises = require("./router/academics/Entreprises");
const students = require("./router/academics/students");
const Employees = require("./router/academics/Employees");
const Auth = require("./router/academics/login");

const admins = require('./router/Human Ressources/admins');
const teachers = require('./router/Human Ressources/teachers');
const staffAuth = require('./router/Human Ressources/auth');


app.use("/api/contactInfo", contactInfo);
app.use("/api/menuItems", menuItems);
app.use("/api/menus", menu);
app.use("/api/media", media);
app.use("/api/gallerieImages", gallerieImages);
app.use("/api/pages", pages);

app.use("/api/formations", formations);

app.use("/api/guardians", guardians);
app.use("/api/students", students);
app.use("/api/entreprises", entreprises);
app.use("/api/employees", Employees);
app.use("/api/auth", Auth);

app.use("/api/admins", admins);
app.use("/api/teachers", teachers);
app.use("/api/staffAuth", staffAuth);

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  console.log(`Listening on port ${port}...`)
);
module.exports = server;
