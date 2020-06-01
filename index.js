const express = require('express');
const app = express();

app.use(express.json());
require('./startup/db')();
require('./startup/config')();

const contactInfo = require('./router/ContactInfo');

app.use('/api/contactInfo', contactInfo);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Listening on port ${port}...`));
module.exports = server;