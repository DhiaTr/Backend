const express = require('express');
const app = express();

app.use(express.json());
require('./startup/db')();
require('./startup/config')();

const contactInfo = require('./router/ContactInfo');
const Formations = require('./router/formations');
const menu = require('./router/menus');
const menuItems = require('./router/menuItems');


app.use('/api/contactInfo', contactInfo);
app.use('/api/formations', Formations);
app.use('/api/menuItems', menuItems);
app.use('/api/menus', menu);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Listening on port ${port}...`));
module.exports = server;