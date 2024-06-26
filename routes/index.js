const express = require('express');
const userRoutes = require('./users');

module.exports = function (io) {
    const app = express.Router();

    // Pass io to user routes
    app.use('/users', userRoutes(io));

    app.all('*', (req, res) => {
        return res.status(200).jsonp({ message: 'Route Not Found' });
    });

    return app;
};
