import { Orders } from './db-models';

export const add = async function (options) {
    const order = new Orders(options);
    return order.save();
};

export const selectOne = async function (options) {
    return Orders.findOne(options);
};

export const select = async function (options = {}) {
    return Orders.findAll(options);
};

export const update = async function (id, options) {
    // options may be: name, code, enabled, description, price, images, stock
    const finder = await selectOne({ where: { id } });
    if (finder) return finder.update(options);
    else return add(options);
};

export const remove = async function (id) {
    let finder = await selectOne({ where: { id } });
    if (finder) return finder.destroy();
};
