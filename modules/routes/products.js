const express = require('express');
const router = express.Router();

const db = require('../db/main');
db.init();
const Products = require('../db/products');

router.get('/list', async (req, res) => {
    const goods = await Products.select();
    res.json(goods);
});

module.exports = router;