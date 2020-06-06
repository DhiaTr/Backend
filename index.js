const express = require('express');
const app = express();

app.use('/uploads', express.static('uploads'))
app.use(express.json());
require('./startup/db')();
require('./startup/config')();

const contactInfo = require('./router/frontCms/ContactInfo');
const Formations = require('./router/frontCms/pages');
const menu = require('./router/frontCms/menus');
const menuItems = require('./router/frontCms/menuItems');
const media = require('./router/frontCms/media');
const gallerieImages = require('./router/frontCms/gallerieImages');

app.use('/api/contactInfo', contactInfo);
app.use('/api/formations', Formations);
app.use('/api/menuItems', menuItems);
app.use('/api/menus', menu);
app.use('/api/media', media);
app.use('/api/gallerieImages', gallerieImages);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Listening on port ${port}...`));
module.exports = server;