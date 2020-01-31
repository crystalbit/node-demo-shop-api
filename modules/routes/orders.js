const express = require('express');
const router = express.Router();
const validateClient = require('../helpers/validateClient');
const passport = require('passport');

const db = require('../db/main');
db.init();
const Orders = require('../db/orders');
const OrdersProducts = require('../db/orders_products');
const Products = require('../db/products');

// tips for user
const BAD_REQUEST = 'Bad request';
const BAD_FIELDS = 'Field validation failed';
const DATABASE_ERROR = 'Database error';
const NOT_AUTHORIZED = 'You are not logged in';

router.post('/push', async (req, res) => {
    const client_id = req.isAuthenticated() ? req.user.id : 0;
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
            client_id,
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

router.get('/get', async (req, res) => {
    if (!req.isAuthenticated()) return res.json({ error: NOT_AUTHORIZED });
    const userId = req.user.id;
    if (userId == 0) return res.json({ error: BAD_REQUEST });
    let orders = await Orders.select({ where: { client_id: userId } });
    let orderById = {};
    orders.forEach(it => orderById[it.id] = {
        id: it.id,
        createdAt: it.createdAt,
        delivery_cost: it.delivery_cost,
        fixed_EUR_USD_rate: it.fixed_EUR_USD_rate,
        products: []
    });

    const productData = await OrdersProducts.select({ where: { order_id: Object.keys(orderById) } });

    let products = new Set();
    productData.forEach(product => products.add(product.product_id));

    let productInfo = await Products.select({ where: { id: Array.from(products) }});

    let productsById = {};
    productInfo.forEach(product => productsById[product.id] = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
    })
    productData.forEach(product => orderById[product.order_id].products.push({
        ...productsById[product.product_id],
        quantity: product.quantity
    }));

    res.json(Object.values(orderById));
});

module.exports = router;