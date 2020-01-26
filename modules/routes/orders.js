var express = require('express');
var router = express.Router();

const db = require('../db/main');
db.init();
const Orders = require('../db/orders');
const OrdersProducts = require('../db/orders_products');

router.post('/push', async (req, res) => {
    const body = req.body;
    console.log(body);
    res.json({ success: true });
});

module.exports = router;