process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
chai.should();

chai.use(chaiHttp);

describe("Тест получения списка продуктов / Loading products api test", function() {
    it(`загружаем продукты / loading products`, function(done) {
        chai.request(app)
            .get('/api/products/list')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.not.be.eql(0);
                done();
            });
    });
});
