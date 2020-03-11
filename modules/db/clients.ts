import { Clients } from './db-models';

export const add: (object) => Promise<any> = function (options) {
    const client = new Clients(options);
    return client.save();
};

export const selectOne: (object) => Promise<any> = function (options) {
    return Clients.findOne(options);
};

export const select = async function (options = {}) {
    return Clients.findAll(options);
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
