const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan(":date :method :url :status :res[content-length] - :response-time ms"));

const db = require('./modules/db');
db.init();

const PORT = process.env.PORT || 3333;

// TODO вынести в роутер
// TODO пагинация
app.get('/api-products', async (req, res) => {
    const goods = await db.selectProducts();
    res.json(goods);
});

app.listen(PORT, '127.0.0.1', () => {
    console.log(`API started at port ${PORT}`);
});

module.exports = app;
