const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
chai.should();
const models = require('../modules/db/db-models');

chai.use(chaiHttp);

const client = {
    email: 
    //Math.ceil(Math.random() * 1000000) + 
    '111@mail.ru',
    password: '1234',
    name: 'John',
    address: 'test test test',
    phone: '+1 (911) 000-0000'
}

/**
 * testing testing test
 * тестовый тест
 * TODO modify while creating routes
 */
describe("Тест регистрации клиента / Client signup test", () => {
    it(`регистрируем / signing up`, async () => {
        // delete demo user if it exists
        await models.clients.destroy({ where: { email: client.email } });

        const res = await chai.request(app)
            .post('/api/auth/register')
            .send(client);

        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.auth.should.be.true;
        return;
    });

    it('вход с правильным паролем / valid login', async () => {
        const res = await chai.request(app)
            .post('/api/auth/login')
            .send(client);
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.auth.should.be.true;
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
