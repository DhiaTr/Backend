const express = require('express');
const router = express.Router();
const mognoose = require('mongoose');

const { Formation } = require('../../models/formation');
const { Menu } = require('../../models/frontCms/menu');
const { MenuItem } = require('../../models/frontCms/menuItem');

router.get('/:menuId', async (req, res) => {
    res.send(await MenuItem.find({ 'menu._id': req.params.menuId }));
});

router.post('/', async (req, res) => {
    
    const PageIdStatus = mognoose.Types.ObjectId.isValid(req.body.page);
    if (!PageIdStatus) return res.status(400).send('Invalid Page id');
    const MenuIdStatus = mognoose.Types.ObjectId.isValid(req.body.menu);
    if (!MenuIdStatus) return res.status(400).send('Invalid Menu id');

    const page = await Formation.findById(req.body.page);
    if (!page) return res.status(400).send('Page not Found.');
    const menu = await Menu.findById(req.body.menu);
    if (!menu) return res.status(400).send('Menu not Found.');

    const menuItem = new MenuItem({
        menu: { _id: menu._id, Name: menu.Name },
        page: { _id: page._id, Name: page.Name }
    });
    res.send(await menuItem.save());


});



module.exports = router;