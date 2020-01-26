const express = require('express');
const router = express.Router();
const validateClient = require('../helpers/validateClient');

const db = require('../db/main');
db.init();
const Orders = require('../db/orders');
const OrdersProducts = require('../db/orders_products');

// tips for user
const BAD_REQUEST = 'Bad request';
const BAD_FIELDS = 'Field validation failed';
const DATABASE_ERROR = 'Database error';

router.post('/push', async (req, res) => {
    const body = req.body;
    if (!body) return res.json({ success: false, msg: BAD_REQUEST });
    const { client, options, positions } = body;
    if (!client || !options || !positions) return res.json({ success: false, msg: BAD_REQUEST });

    const clientValidation = validateClient(client);
    if (clientValidation.name || clientValidation.address || clientValidation.email || clientValidation.phone) {
        return res.json({ success: false, msg: BAD_FIELDS });
    }

    try {
        let newOrder = await Orders.add({
            client_id: 0, // for auth, not implemented yet
            phone: client.phone,
            email: client.email,
            delivery_cost: options.delivery_cost,
            fixed_EUR_USD_rate: 1, // not implemented yet
            name: client.name,
            address: client.address
        });

        let order_id = newOrder.id;

        let addPositionPromises = [];
        for (const i in positions) {
            addPositionPromises.push(await OrdersProducts.add({
                order_id,
                product_id: positions[i].id,
                quantity: positions[i].quantity
            }));
        }
        await Promise.all(addPositionPromises);
    } catch (error) {
        console.log(error);
        return res.json({ success: false, msg: DATABASE_ERROR });
    }

    res.json({ success: true });
});

module.exports = router;