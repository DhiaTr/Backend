const express = require('express');
const router = express.Router();

const { Formation } = require('../models/formation');
const { Menu } = require('../models/menu');
const { MenuItem } = require('../models/menuItem');

router.get('/:menuId', async (req, res) => {
    res.send(await MenuItem.find({ 'menu._id': req.params.menuId }));
});

router.post('/', async (req, res) => {

    const page = await Formation.findById(req.body.page);
    const menu = await Menu.findById(req.body.menu);

    const menuItem = new MenuItem({
        menu: { _id: menu._id, Name: menu.Name },
        page: { _id: page._id, Name: page.Name }
    });
    res.send(await menuItem.save());


});



module.exports = router;