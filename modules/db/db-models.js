const Sequelize = require('sequelize');
const { mysql } = require('../../config');

let sequelize = null;

/**
 * @returns {Promise} result of sequelize.authenticate()
 */
const sequelizeInit = () => {
    sequelize = new Sequelize(mysql.database, mysql.user, mysql.password, {
        host: mysql.host,
        port: mysql.port || 3306,
        dialect: 'mysql',
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        logging: false
    });
    return sequelize.authenticate();
}
sequelizeInit();

const tables = {
    products: mysql.prefix + 'products',
    orders: mysql.prefix + 'orders',
    orders_products: mysql.prefix + 'orders_products',
    clients: mysql.prefix + 'clients'
};

var Model = Sequelize.Model;

class Products extends Model {};
Products.init({
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: Sequelize.STRING(1000), allowNull: false },
    subheader: { type: Sequelize.STRING(200), allowNull: true },
    code: { type: Sequelize.STRING(100), allowNull: false },
    enabled: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
    description: { type: Sequelize.STRING(5000), allowNull: true },
    price: { type: Sequelize.DECIMAL(9,2), allowNull: false },
    image: { type: Sequelize.STRING(100), allowNull: true }, // JSON
}, {
    sequelize,
    modelName: tables.products,
    indexes: [
        {
          unique: 'code',
          fields: ['code']
        }
    ]
});

/**
 * addressTemplate to be used both in Orders and Clients
 */
const addressTemplate = {
    name: { type: Sequelize.STRING(300), allowNull: false },
    address: { type: Sequelize.STRING(300), allowNull: false },
    phone: { type: Sequelize.STRING(100), allowNull: false },
    email: { type: Sequelize.STRING(200), allowNull: false },
};

class Orders extends Model {};
Orders.init({
    id: { type: Sequelize.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    client_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: true }, // can be null - client not reg-ed
    ...addressTemplate,
    delivery_cost: { type: Sequelize.DECIMAL(9,2), allowNull: false },
    fixed_EUR_USD_rate: { type: Sequelize.DECIMAL(6,4), allowNull: false },
}, {
    sequelize,
    modelName: tables.orders
});

class OrdersProducts extends Model {};
OrdersProducts.init({
    id: { type: Sequelize.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    order_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
    product_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
    quantity: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false }
}, {
    sequelize,
    modelName: tables.orders_products
});

class Clients extends Model {};
Clients.init({
    id: { type: Sequelize.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    // email is in addressTemplate
    password_hash: { type: Sequelize.STRING, allowNull: false },
    password_salt: { type: Sequelize.STRING, allowNull: false },
    ...addressTemplate
}, {
    sequelize,
    modelName: tables.clients,
    indexes: [
        {
            unique: 'login',
            fields: ['login']
        }
    ]
});

module.exports = {
    products: Products,
    orders: Orders,
    orders_products: OrdersProducts,
    clients: Clients,
    init: async function () {
        if (!sequelize) sequelizeInit();
    },
    sync: async function () {
        return [
            Products.sync({ alter: true }),
            Orders.sync({ alter: true }),
            OrdersProducts.sync({ alter: true }),
            Clients.sync({ alter: true }),
        ];
    },
    close: async function () {
        sequelize.close();
        sequelize = null;
    }
}
