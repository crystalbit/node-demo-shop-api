const models = require("./db-models");

module.exports = {
    init: async function () {
        await models.init();
        await models.sync();
    },
    close: models.close,
    addProduct: async function (options) {
        const product = new models.products(options);
        return product.save();
    },
    selectOneProduct: async function (options) {
        return models.products.findOne(options);
    },
    selectProducts: async function (options = {}) {
        return models.products.findAll(options);
    },
    updateProduct: async function (id, options) {
        // options may be: name, code, enabled, description, price, images, stock
        const finder = await this.selectOneProduct({ where: { id } });
        if (finder) return finder.update(options);
        else return this.addProduct(options);
    },
    deleteProduct: async function (id) {
        let finder = await this.selectOneProduct({ where: { id } });
        if (finder) return finder.destroy();
    },
    selectCities: async function () {
        return models.cities.findAll();
    },
    addCity: async function (options) {
        const city = new models.cities(options);
        return city.save();
    },
}
