const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
chai.should();

chai.use(chaiHttp);

const orderData = {
    client: {
        name: 'wewr',
        address: 'pushkinaewfrae',
        email: 'dfsf@tr.ty',
        phone: '+7 (545) 454-5448'
    },
    options: {
        delivery_cost: 5
    },
    positions: {
        '2': {
            id: 2,
            quantity: 2
        },
        '3': {
            id: 3,
            quantity: 1
        }
    }
}

describe("Тест создания заказа / Creating order test", function() {
    it(`создаём заказ / creating order`, function(done) {
        const order = Object.assign(orderData);
        chai.request(app)
            .post('/api/orders/push')
            .set('content-type', 'application/json')
            .send(order)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.success.should.be.true;
                done();
            });
    });
    it(`проверяем серверную валидацию / check server validation`, function(done) {
        const order = Object.assign(orderData);
        order.client.phone = 'not a valid phone'; // it validates with mask so should fail
        chai.request(app)
            .post('/api/orders/push')
            .set('content-type', 'application/json')
            .send(order)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.success.should.be.false;
                res.body.msg.should.be.equal('Field validation failed');
                done();
            });
    });
});
