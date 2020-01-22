const models = require("./db-models");

module.exports = {
    add: async function (options) {
        const product = new models.products(options);
        return product.save();
    },
    selectOne: async function (options) {
        return models.products.findOne(options);
    },
    select: async function (options = {}) {
        return models.products.findAll(options);
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
