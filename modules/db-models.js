const Sequelize = require("sequelize");
const { mysql } = require("../config");

let sequelize = null;

const sequelizeInit = () => {
    sequelize = new Sequelize(mysql.database, mysql.user, mysql.password, {
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
}
sequelizeInit();

const tables = {
    products: mysql.prefix + "products",
    cities: mysql.prefix + "cities",
};

var Model = Sequelize.Model;

class Products extends Model {};
Products.init({
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: Sequelize.STRING(1000), allowNull: false },
    code: { type: Sequelize.STRING(100), allowNull: false, unique: true },
    enabled: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
    description: { type: Sequelize.STRING(5000), allowNull: true },
    price: { type: Sequelize.DECIMAL(9,2), allowNull: false },
    images: { type: Sequelize.JSON, allowNull: true }, // JSON
    stock: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, defaultValue: true }
}, {
    sequelize,
    modelName: tables.products
});

// города спарсю регуляркой отсюда: https://www.homeenglish.ru/Othercityrussia.htm
// /<td>([а-яА-Я]*?)<\/td>\n\s*<td>([a-zA-Z]*?)<\/td>/gm
// дамп по запросу могу дать, на демо-сервере оно будет уже в бд
class Cities extends Model {};
Cities.init({
    id: { type: Sequelize.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    name: { type: Sequelize.STRING(100), allowNull: false },
    name_local: { type: Sequelize.STRING(100), allowNull: false }
}, {
    sequelize,
    modelName: tables.cities
});

module.exports = {
    products: Products,
    cities: Cities,
    init: async function () {
        if (!sequelize) sequelizeInit();
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    },
    sync: async function () {
        return [
            Products.sync({ alter: true }),
            Cities.sync({ alter: true }),
        ];
    },
    close: async function () {
        sequelize.close();
        sequelize = null;
    }
}
