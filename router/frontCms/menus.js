const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { Menu, validateMenu, validateItem } = require('../../models/frontCms/menu');
const { Page } = require('../../models/frontCms/page');

router.get('/', async (req, res) => {
    res.send(await Menu.find().populate('[items].Page'));
});

router.get('/:id', async (req, res) => {

    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send('invalid id.');

    let menu = await Menu.findById(req.params.id).populate('[items].Page');
    if (!menu) return res.status(400).send('invalid menu.');

    res.send(menu);
})

router.post('/', async (req, res) => {

    const { error } = validateMenu.validate(req.body);
    if (error) return res.status(400).send(error.message);

    const menu = new Menu({
        Name: req.body.Name,
        Description: req.body.Description,
        items: []
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

    menu = await Menu.findByIdAndUpdate(req.params.id, {
        Name: req.body.Name,
        Description: req.body.Description
    }, {
        new: true
    });
    res.send(menu);
});

router.put('/:id/addItem/', async (req, res) => {
    const idStatus = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idStatus) return res.status(400).send('invalid id.');

    let menu = await Menu.findById(req.params.id);
    if (!menu) return res.status(400).send('invalid menu.');

    const { error } = validateItem.validate(req.body);
    if (error) return res.status(400).send(error.message);

    const page = await Page.findById(req.body.Page);
    if (!page) return res.status(400).send('invalid page.');

    menu.items.push(req.body);
    await Menu.findByIdAndUpdate(req.params.id, {
        Name: menu.Name,
        Description: menu.Description,
        items: menu.items
    }, {
        new: true
    });
    res.send(menu);
});

router.put('/:menuId/deleteItem/:itemId', async (req, res) => {
    const menuIdStatus = mongoose.Types.ObjectId.isValid(req.params.menuId);
    if (!menuIdStatus) return res.status(400).send('invalid menu id.');

    const itemIdStatus = mongoose.Types.ObjectId.isValid(req.params.itemId);
    if (!itemIdStatus) return res.status(400).send('invalid Item id.');

    let menu = await Menu.findById(req.params.menuId);
    if (!menu) return res.status(400).send('invalid menu.');

    let item = menu.items.find(item => item._id == req.params.itemId);
    // 2 equals to make this part work
    if (!item) return res.status(400).send('invalid item');

    menu.items = menu.items.filter(item => item._id != req.params.itemId)
    await Menu.findByIdAndUpdate(req.params.menuId, menu);
    res.send(menu);

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