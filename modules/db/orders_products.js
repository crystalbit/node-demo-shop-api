const models = require("./db-models");

module.exports = {
    add: async function (options) {
        const order_product = new models.orders_products(options);
        return order_product.save();
    },
    selectOne: async function (options) {
        return models.orders_products.findOne(options);
    },
    select: async function (options = {}) {
        return models.orders_products.findAll(options);
    },
    update: async function (id, options) {
        // options may be: name, code, enabled, description, price, images, stock
        const finder = await this.selectOne({ where: { id } });
        if (finder) return finder.update(options);
        else return this.add(options);
    },
    delete: async function (id) {
        let finder = await this.selectOne({ where: { id } });
        if (finder) return finder.destroy();
    },
}
