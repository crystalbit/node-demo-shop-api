const Sequelize = require('sequelize');
const { prod, dev, test } = require('../../config');

let sequelize = null;

const mysql = prod.mysql;

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
}
sequelizeInit();

const tables = {
    products: mysql.prefix + 'products',
    cities: mysql.prefix + 'cities',
    orders: mysql.prefix + 'orders',
    orders_products: mysql.prefix + 'orders_products',
    clients: mysql.prefix + 'clients'
};

var Model = Sequelize.Model;

class Products extends Model {};
Products.init({
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: Sequelize.STRING(1000), allowNull: false },
    code: { type: Sequelize.STRING(100), allowNull: false },
    enabled: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
    description: { type: Sequelize.STRING(5000), allowNull: true },
    price: { type: Sequelize.DECIMAL(9,2), allowNull: false },
    images: { type: Sequelize.JSON, allowNull: true }, // JSON
    stock: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, defaultValue: true }
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
 * cities parsed from www.homeenglish.ru/Othercityrussia.htm
 * regex for it is /<td>([а-яА-Я]*?)<\/td>\n\s*<td>([a-zA-Z]*?)<\/td>/gm
 * to autofill not missing cities run test test/db-cities.js (mocha)
 * 
 * автозаполнение недостающих с помощью теста test/db-cities.js (mpcha)
 */
class Cities extends Model {};
Cities.init({
    id: { type: Sequelize.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    name: { type: Sequelize.STRING(100), allowNull: false },
    name_local: { type: Sequelize.STRING(100), allowNull: false }
}, {
    sequelize,
    modelName: tables.cities
});

/**
 * addressTemplate to be used both in Orders and Clients
 */
const addressTemplate = {
    full_name: { type: Sequelize.STRING(300), allowNull: false },
    city_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
    street_address_1: { type: Sequelize.STRING(300), allowNull: false },
    street_address_2: { type: Sequelize.STRING(300), allowNull: true },
    zip: { type: Sequelize.INTEGER.UNSIGNED, allowNull: true }, // shall we know zip to order pizza? ;)
    phone: { type: Sequelize.STRING(100), allowNull: false },
    email: { type: Sequelize.STRING(200), allowNull: true },
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
    login: { type: Sequelize.STRING(30), allowNull: false },
    password_hash: { type: Sequelize.STRING, allowNull: false },
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
    cities: Cities,
    orders: Orders,
    orders_products: OrdersProducts,
    clients: Clients,
    init: async function () {
        if (!sequelize) sequelizeInit();
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    },
    sync: async function () {
        return [
            Products.sync({ alter: true }),
            Cities.sync({ alter: true }),
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
