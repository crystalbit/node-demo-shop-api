const express = require('express');
const app = express();

const db = require('./modules/db/main');
const Product = require('./modules/db/product');
db.init();

const PORT = process.env.PORT || 3333;

// TODO вынести в роутер
// TODO пагинация
app.get('/api-products', async (req, res) => {
    const goods = await Product.select();
    res.json(goods);
});

app.listen(PORT, '127.0.0.1', () => {
    console.log(`API started at port ${PORT}`);
});
