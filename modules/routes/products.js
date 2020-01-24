var express = require('express');
var router = express.Router();

const db = require('../db/main');
db.init();
const Products = require('../db/products');

// TODO пагинация
router.get('/list', async (req, res) => {
    const goods = await Products.select();
    res.json(goods);
});

module.exports = router;