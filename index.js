const express = require('express');
const app = express();

app.use('/uploads', express.static('uploads'))
app.use(express.json());
require('./startup/db')();
require('./startup/config')();

const contactInfo = require('./router/frontCms/ContactInfo');
const menu = require('./router/frontCms/menus');
const menuItems = require('./router/frontCms/menuItems');
const media = require('./router/frontCms/media');
const gallerieImages = require('./router/frontCms/gallerieImages');
const pages = require('./router/frontCms/pages');

const formations = require('./router/formations/formations');

app.use('/api/contactInfo', contactInfo);
app.use('/api/menuItems', menuItems);
app.use('/api/menus', menu);
app.use('/api/media', media);
app.use('/api/gallerieImages', gallerieImages);
app.use('/api/pages', pages);
app.use('/api/formations', formations);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Listening on port ${port}...`));
module.exports = server;