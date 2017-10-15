var express = require('express');
var morgan = require('morgan');

var db = require('./db');
var rideController = require('./controllers/ride-controller');

/* Get an Express app instance */
var app = express();

/* Set up request logging */
if(process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
}

/* Declare our routes */
app.use('/rides', rideController);

module.exports = app;
