var express = require('express');
var morgan = require('morgan');

var db = require('./db');
var rideController = require('./controllers/ride-controller');
var userController = require('./controllers/user-controller');
var authController = require('./controllers/auth-controller');

/* Get an Express app instance */
var app = express();

/* Set up request logging */
if(process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
}

/* Declare our routes */
app.use('/api/rides', rideController);
app.use('/api/users', userController);
app.use('/api/auth', authController);

module.exports = app;
