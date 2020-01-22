const express = require('express');
const app = express();
const db = require('./modules/db');

const PORT = process.env.PORT || 80;

// TODO вынести в роутер
// TODO пагинация
app.get('/api-goods', async (req, res) => {
    const goods = await db.selectProducts();
    res.json(goods);
});

app.listen(PORT, '127.0.0.1', () => {
    console.log(`API started at port ${PORT}`);
});
