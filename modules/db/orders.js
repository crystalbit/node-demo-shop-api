const models = require("./db-models");

module.exports = {
    add: async function (options) {
        console.log(options)
        const order = new models.orders(options);
        return order.save();
    },
    selectOne: async function (options) {
        return models.orders.findOne(options);
    },
    select: async function (options = {}) {
        return models.orders.findAll(options);
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
