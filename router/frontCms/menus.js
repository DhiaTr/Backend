const express = require('express');
const router = express.Router();

const { Menu } = require('../../models/frontCms/menu');

router.get('/', async (req, res) => {
    res.send(await Menu.find());
});

router.post('/', async (req, res) => {

    const menu = new Menu({
        Name: req.body.Name,
        Description: req.body.Description,
    });
    res.send(await menu.save());
});

router.put('/:id', async (req, res) => {

    const menu = new Menu({
        Name: req.body.Name,
        Description: req.body.Description,
    });
    res.send(await menu.save());
});


module.exports = router;