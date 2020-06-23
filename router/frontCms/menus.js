const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Menu, validateMenu } = require('../../models/frontCms/menu');

router.get('/', async (req, res) => {
    res.send(await Menu.find());
});

router.get('/:id', async (req, res) => {

    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send('invalid id.');

    let menu = await Menu.findById(req.params.id);
    if (!menu) return res.status(400).send('invalid menu.');

    res.send(menu);
})

router.post('/', async (req, res) => {

    const { error } = validateMenu.validate(req.body);
    if (error) return res.status(400).send(error.message);

    const menu = new Menu({
        Name: req.body.Name,
        Description: req.body.Description,
    });
    res.send(await menu.save());
});

router.put('/:id', async (req, res) => {

    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send('invalid id.');

    let menu = await Menu.findById(req.params.id);
    if (!menu) return res.status(400).send('invalid menu.');

    const { error } = validateMenu.validate(req.body);
    if (error) return res.status(400).send(error.message);

    menu = new Menu({
        Name: req.body.Name,
        Description: req.body.Description,
    });
    res.send(await menu.save());
});

router.delete('/:id', async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send('invalid id.');

    let menu = await Menu.findById(req.params.id);
    if (!menu) return res.status(400).send('invalid menu.');

    await Menu.findByIdAndDelete(req.params.id);
    res.send(menu);
});


module.exports = router;