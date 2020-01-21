const express = require('express');
const app = express();

const PORT = process.env.PORT || 80;

// mock
app.get('/api-goods', (req, res) => {
    res.json([
        {
            id: 1,
            name: 'pizza'
        },
        {
            id: 2,
            name: 'big pizza'
        },
        {
            id: 3,
            name: 'big delicious pizza'
        }
    ]);
});

app.listen(PORT, '127.0.0.1', () => {
    console.log(`API started at port ${PORT}`);
});
