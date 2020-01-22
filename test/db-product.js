const crypto = require("crypto");
const uuidv4 = require('uuid/v4');
const expect = require("chai").expect;

const db = require('../modules/db/main');
const Products = require('../modules/db/products');

const product = {
    //name, code, enabled, description, price, images, stock
    // имя товара - слово /пицца/ и 20 случайных байт
    name: 'пицца "' + crypto.randomBytes(20).toString('hex') + '"',
    code: uuidv4(),
    enabled: Math.random() > 0.3,
    description: uuidv4() + ' ' + uuidv4() + '\n' + uuidv4(),
    price: (500 + Math.ceil(500 * Math.random())).toFixed(2),
    images: [],
    stock: 500 + Math.ceil(500 * Math.random())
};

// go tests
describe("Тест продукта", function() {
    var id = null;

    before(async function() {
        await db.init();
    });

    it(`создаём продукт "${product.name}"`, async function() {
        const created = await Products.add(product);
        const values = created.dataValues;
        expect(typeof values).to.be.equal('object');
        expect(typeof values.id).to.be.equal('number');
        expect(values.name).to.be.equal(product.name);
        expect(values.code).to.be.equal(product.code);
        expect(values.enabled).to.be.equal(product.enabled);
        expect(values.description).to.be.equal(product.description);
        expect(values.price).to.be.eql(product.price);
        expect(values.images).to.be.equal(product.images);
        expect(values.stock).to.be.equal(product.stock);
        id = values.id;
    });
    it("обновляем этот продукт", async function() {
        const newDescription = uuidv4();
        const values = await Products.update(id, { description: newDescription });
        expect(typeof values).to.be.equal('object');
        expect(typeof values.id).to.be.equal('number');
        expect(values.name).to.be.equal(product.name);
        expect(values.code).to.be.equal(product.code);
        expect(values.enabled).to.be.equal(product.enabled);
        expect(values.description).to.be.equal(newDescription); // изменённое
        expect(values.price).to.be.equal(product.price);
        expect(values.images).to.be.eql(product.images);
        expect(values.stock).to.be.equal(product.stock);
    });
    it("находим этот продукт", async function() {
        const finder = await Products.select({ where: { id }});
        const values = finder[0].dataValues;
        expect(typeof values).to.be.equal('object');
        expect(typeof values.id).to.be.equal('number');
        expect(values.name).to.be.equal(product.name);
        expect(values.code).to.be.equal(product.code);
        expect(values.enabled).to.be.equal(product.enabled);
        expect(values.price).to.be.equal(product.price);
        expect(values.images).to.be.eql(product.images);
        expect(values.stock).to.be.equal(product.stock);
    });
    it("удаляем продукт", async function() {
        let result = await Products.delete(id);
        const values = result.dataValues;
        expect(typeof values).to.be.equal('object');
        expect(typeof values.id).to.be.equal('number');
        expect(values.name).to.be.equal(product.name);
        expect(values.code).to.be.equal(product.code);
        expect(values.enabled).to.be.equal(product.enabled);
        expect(values.price).to.be.equal(product.price);
        expect(values.images).to.be.eql(product.images);
        expect(values.stock).to.be.equal(product.stock);
    });
    it("продукт удалён, и его уже не найти", async function() {
        const finder = await Products.select({ where: { id }});
        expect(finder.length).to.be.equal(0);
    });
});