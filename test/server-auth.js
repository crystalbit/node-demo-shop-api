const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
chai.should();
const models = require('../modules/db/db-models');

chai.use(chaiHttp);
process.env.NODE_ENV = 'test';

const client = {
    email: '111@mail.ru',
    password: '123456',
    name: 'John',
    address: 'test test test',
    phone: '+7 (911) 000-0000'
}

describe("Тест регистрации клиента / Client signup test", () => {
    after(async () => {
        // delete demo user if it exists
        await models.clients.destroy({ where: { email: client.email } });
    });

    it('регистрируем / signing up', async () => {
        // delete demo user if it exists
        await models.clients.destroy({ where: { email: client.email } });

        const res = await chai.request(app)
            .post('/api/auth/register')
            .send(client);

        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.auth.should.be.true;
        res.body.client.should.be.an('object');
        res.body.client.name.should.be.equal(client.name);
        res.body.client.address.should.be.equal(client.address);
        res.body.client.email.should.be.equal(client.email);
        res.body.client.phone.should.be.equal(client.phone);
        return;
    });

    it('повторная регистрация той же почты / signing up with existing email', async () => {
        const res = await chai.request(app)
            .post('/api/auth/register')
            .send(client);

        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.auth.should.be.false;
        res.body.validator.should.be.an('object');
        res.body.validator.email.should.be.equal('User with this email already exists');
        return;
    });

    it('вход с правильным паролем / valid login', async () => {
        const res = await chai.request(app)
            .post('/api/auth/login')
            .send(client);
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.auth.should.be.true;
        res.body.client.should.be.an('object');
        res.body.client.name.should.be.equal(client.name);
        res.body.client.address.should.be.equal(client.address);
        res.body.client.email.should.be.equal(client.email);
        res.body.client.phone.should.be.equal(client.phone);
    });

    it('вход с неправильным паролем / invalid login', async () => {
        const res = await chai.request(app)
            .post('/api/auth/login')
            .send({ ...client, password: 'notvalidpass' });
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.auth.should.be.false;
    });

    it('выход / logout', async () => {
        const res = await chai.request(app)
            .get('/api/auth/logout')
            .send();
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.auth.should.be.false;
    });
});
