process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
chai.should();
const models = require('../modules/db/db-models');

chai.use(chaiHttp);

const client = {
    email: '222@mail.ru',
    password: '123456',
    name: 'John',
    address: 'test test test',
    phone: '+7 (911) 000-0000'
}

const clientWrongMail = { ...client, email: 'wrong' };
const clientWrongName = { ...client, name: 'D' };
const clientWrongAddress = { ...client, address: 'short' };
const clientWrongPhone = { ...client, phone: 'not by mask' };
const clientShortPassword = { ...client, password: '12345' };
const clientLongPassword = { ...client, password: '12345678901234567890' };
const clientBadSymbolPassword = { ...client, password: '12345±' };

describe("Тест валидации при регистрации клиента / Client validation at signup test", () => {
    beforeEach(async () => {
        // delete demo user if it exists
        await models.clients.destroy({ where: { email: client.email } });
    });

    after(async () => {
        // delete demo user if it exists
        await models.clients.destroy({ where: { email: client.email } });
    });

    it('try wrong email', async () => {
        const res = await chai.request(app)
            .post('/api/auth/register')
            .send(clientWrongMail);

        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.auth.should.be.false;
        res.body.validator.should.be.an('object');
        res.body.validator.email.should.be.equal('Please, provide a valid email');
        return;
    });

    it('try wrong name', async () => {
        const res = await chai.request(app)
            .post('/api/auth/register')
            .send(clientWrongName);

        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.auth.should.be.false;
        res.body.validator.should.be.an('object');
        res.body.validator.name.should.be.equal('Name shall be 3 symbols or more');
        return;
    });

    it('try wrong address', async () => {
        const res = await chai.request(app)
            .post('/api/auth/register')
            .send(clientWrongAddress);

        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.auth.should.be.false;
        res.body.validator.should.be.an('object');
        res.body.validator.address.should.be.equal('Address shall be 10 symbols or more');
        return;
    });

    it('try wrong phone', async () => {
        const res = await chai.request(app)
            .post('/api/auth/register')
            .send(clientWrongPhone);

        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.auth.should.be.false;
        res.body.validator.should.be.an('object');
        res.body.validator.phone.should.be.equal('Phone validation error');
        return;
    });

    it('try short password', async () => {
        const res = await chai.request(app)
            .post('/api/auth/register')
            .send(clientShortPassword);

        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.auth.should.be.false;
        res.body.validator.should.be.an('object');
        res.body.validator.password.should.be.equal('Select password to be 6 to 16 English/Russian symbols, digits and that stuff: @#$%^&*');
        return;
    });

    it('try long password', async () => {
        const res = await chai.request(app)
            .post('/api/auth/register')
            .send(clientLongPassword);

        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.auth.should.be.false;
        res.body.validator.should.be.an('object');
        res.body.validator.password.should.be.equal('Select password to be 6 to 16 English/Russian symbols, digits and that stuff: @#$%^&*');
        return;
    });

    it('try password with bad symbol', async () => {
        const res = await chai.request(app)
            .post('/api/auth/register')
            .send(clientBadSymbolPassword);

        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.auth.should.be.false;
        res.body.validator.should.be.an('object');
        res.body.validator.password.should.be.equal('Select password to be 6 to 16 English/Russian symbols, digits and that stuff: @#$%^&*');
        return;
    });
});
