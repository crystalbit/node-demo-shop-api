const Sequelize = require("sequelize");
const { mysql } = require("../config");

var sequelize = new Sequelize(mysql.database, mysql.user, mysql.password, {
    host: mysql.host,
    port: mysql.port || 3306,
    dialect: "mysql",
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: false
});

const tables = {
    products: mysql.prefix + "products",
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
    images: { type: Sequelize.TEXT('long'), allowNull: true }, // JSON
    stock: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true }
}, {
    sequelize,
    modelName: tables.products
});

module.exports = {
    products: Products,
    init: async function () {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    },
    sync: async function () {
        return [
            Products.sync({ alter: true }),
        ];
    }
}
