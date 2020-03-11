import { Sequelize, Model, DataTypes, ModelAttributes } from 'sequelize';
import { mysql } from '../../config';
import { IModelNames } from './interfaces';

let sequelize: Sequelize | null = null;

/**
 * @returns {Promise} result of sequelize.authenticate()
 */
const sequelizeInit: () => Promise<any> = () => {
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

const tables: IModelNames = {
    products: mysql.prefix + 'products',
    orders: mysql.prefix + 'orders',
    orders_products: mysql.prefix + 'orders_products',
    clients: mysql.prefix + 'clients'
};

export class Products extends Model {
    public id!: number;
    public name!: string;
    public subheader: string;
    public code!: string;
    public enabled!: boolean;
    public description: string;
    public price!: number;
    public image: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
};

Products.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(1000), allowNull: false },
    subheader: { type: DataTypes.STRING(200), allowNull: true },
    code: { type: DataTypes.STRING(100), allowNull: false },
    enabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    description: { type: DataTypes.STRING(5000), allowNull: true },
    price: { type: DataTypes.DECIMAL(9,2), allowNull: false },
    image: { type: DataTypes.STRING(100), allowNull: true }, // JSON
}, {
    sequelize,
    modelName: tables.products,
    indexes: [
        {
            unique: true,
            fields: ['code']
        }
    ]
});

/**
 * addressTemplate to be used both in Orders and Clients
 */
const addressTemplate: ModelAttributes = {
    name: { type: DataTypes.STRING(300), allowNull: false },
    address: { type: DataTypes.STRING(300), allowNull: false },
    phone: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(200), allowNull: false },
};

export class Orders extends Model {
    public id!: number;
    public client_id: number;
    public name!: string;
    public address!: string;
    public phone!: string;
    public email!: string;
    public delivery_cost!: number;
    public fixed_EUR_USD_rate!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
};

Orders.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    client_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true }, // can be null - client not reg-ed
    ...addressTemplate,
    delivery_cost: { type: DataTypes.DECIMAL(9,2), allowNull: false },
    fixed_EUR_USD_rate: { type: DataTypes.DECIMAL(6,4), allowNull: false },
}, {
    sequelize,
    modelName: tables.orders
});

export class OrdersProducts extends Model {
    public id!: number;
    public order_id!: number;
    public product_id!: number;
    public quantity!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
};

OrdersProducts.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    order_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    product_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    quantity: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false }
}, {
    sequelize,
    modelName: tables.orders_products
});

export class Clients extends Model {
    public id!: number;
    public password_hash!: string;
    public password_salt!: string;
    public name!: string;
    public address!: string;
    public phone!: string;
    public email!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
};

Clients.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    // email is in addressTemplate
    password_hash: { type: DataTypes.STRING, allowNull: false },
    password_salt: { type: DataTypes.STRING, allowNull: false },
    ...addressTemplate
}, {
    sequelize,
    modelName: tables.clients,
    indexes: [
        {
            unique: true,
            fields: ['email']
        }
    ]
});

export const init: () => Promise<any> | undefined = function () {
    if (!sequelize) return sequelizeInit();
};

export const sync: () => Array<Promise<any>> = function () : Array<Promise<any>> {
    return [
        Products.sync({ alter: false }),
        Orders.sync({ alter: false }),
        OrdersProducts.sync({ alter: false }),
        Clients.sync({ alter: false }),
    ];
};

export const close: () => Promise<void> = function () {
    const result: Promise<void> = sequelize.close();
    sequelize = null;
    return result;
};
