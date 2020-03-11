import { OrdersProducts } from './db-models';

export const add: (object) => Promise<any> = async function (options) {
    const order_product: OrdersProducts = new OrdersProducts(options);
    return order_product.save();
};

export const selectOne: (object) => Promise<any> = function (options) {
    return OrdersProducts.findOne(options);
};

export const select: (object) => Promise<any> = function (options = {}) {
    return OrdersProducts.findAll(options);
};

export const update: (number, options) => Promise<any> = async function (id, options) {
    // options may be: name, code, enabled, description, price, images, stock
    const finder: OrdersProducts | null = await selectOne({ where: { id } });
    if (finder) return finder.update(options);
    else return add(options);
};

export const remove: (number) => Promise<any> = async function (id) {
    let finder: OrdersProducts | null = await selectOne({ where: { id } });
    if (finder) return finder.destroy();
};

