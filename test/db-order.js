const crypto = require("crypto");
const uuidv4 = require('uuid/v4');
const expect = require("chai").expect;

const db = require('../modules/db/main');
const Orders = require('../modules/db/orders');
const OrdersProducts = require('../modules/db/orders_products');
const Products = require('../modules/db/products');

const order = {
    client_id: 0, // auth not implemented yet
    phone: '+7 (545) 454-5448',
    email: 'dfsf@tr.ty',
    delivery_cost: 5,
    fixed_EUR_USD_rate: 1, // not implemented yet
    name: 'John',
    address: 'Pushkina str. 9'
}

const position = {
    product_id: 1,
    quantity: 2
}

// go tests
describe("Order test / Тест заказа", function() {
    var order_id = null;
    var position_id = null;

    before(async function() {
        await db.init();
    });

    after(async function() {
        await OrdersProducts.delete(position_id);
        await Orders.delete(order_id);
    });

    it(`create order / создаём заказ`, async function() {
        const created = await Orders.add(order);
        order_id = created.id;
        expect(order_id).to.be.at.least(1);
        expect(created.client_id).to.be.equal(order.client_id);
        expect(created.phone).to.be.equal(order.phone);
        expect(created.email).to.be.equal(order.email);
        expect(created.delivery_cost).to.be.equal(order.delivery_cost);
        expect(created.fixed_EUR_USD_rate).to.be.equal(order.fixed_EUR_USD_rate);
        expect(created.name).to.be.equal(order.name);
        expect(created.address).to.be.equal(order.address);
    });
    it(`adding position / добавляем позицию`, async function() {
        const created = await OrdersProducts.add({ order_id, ...position });
        position_id = created.id;
        expect(position_id).to.be.at.least(1);
        expect(created.order_id).to.be.equal(order_id);
        expect(created.product_id).to.be.equal(position.product_id);
        expect(created.quantity).to.be.equal(position.quantity);
    });
});