const production = process.env.NODE_ENV === 'production';
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require("body-parser");

const productsRoutes = require('./modules/routes/products');
const ordersRoutes = require('./modules/routes/orders');

app.use(bodyParser.json());

// enable cross-domain requests for dev env
if (!production) app.use(cors());

app.use(morgan(":date :method :url :status :res[content-length] - :response-time ms"));

const PORT = process.env.PORT || 3333;

app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);

app.listen(PORT, '127.0.0.1', () => {
    console.log(`API started at port ${PORT}`);
});

module.exports = app;
