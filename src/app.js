const express = require('express');
const cors = require('cors');
const loggerMiddleware = require('./middlewares/logger');

const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'API is running!' });
});

app.use('/api', routes);

module.exports = app;
