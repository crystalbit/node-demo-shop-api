import express from 'express';
const router = express.Router();
import validateClient from '../helpers/validateClient';

import { init as initDB } from '../db/main';
initDB();
import { add as addOrder, select as selectOrder } from '../db/orders';
import { add as addOrderProduct, select as selectOrderProduct } from '../db/orders_products';
import { select as selectProducts } from '../db/products';
import { IPushBody } from '../db/interfaces';

// tips for user
const BAD_REQUEST: string = 'Bad request';
const BAD_FIELDS: string = 'Field validation failed';
const DATABASE_ERROR: string = 'Database error';
const NOT_AUTHORIZED: string = 'You are not logged in';

router.post('/push', async (req, res) => {
    const client_id: number = req.isAuthenticated() ? req.user.id : 0;
    const body: IPushBody | undefined = req.body;
    if (!body) return res.json({ success: false, msg: BAD_REQUEST });
    const { client, options, positions } = body;
    if (!client || !options || !positions) return res.json({ success: false, msg: BAD_REQUEST });

    const clientValidation = validateClient(client);
    if (clientValidation.name || clientValidation.address || clientValidation.email || clientValidation.phone) {
        return res.json({ success: false, msg: BAD_FIELDS });
    }

    try {
        let newOrder = await addOrder({
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
            addPositionPromises.push(await addOrderProduct({
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
    let orders = await selectOrder({ where: { client_id: userId } });
    let orderById = {};
    orders.forEach(it => orderById[it.id] = {
        id: it.id,
        createdAt: it.createdAt,
        delivery_cost: it.delivery_cost,
        fixed_EUR_USD_rate: it.fixed_EUR_USD_rate,
        products: []
    });

    const productData = await selectOrderProduct({ where: { order_id: Object.keys(orderById) } });

    let products = new Set();
    productData.forEach(product => products.add(product.product_id));

    let productInfo = await selectProducts({ where: { id: Array.from(products) }});

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

export default router;
