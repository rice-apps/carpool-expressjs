var express = require('express');
var morgan = require('morgan');

var db = require('./db');
var rideController = require('./controllers/ride-controller');

var app = express();

app.use(morgan('combined'));

app.use('/rides', rideController);

module.exports = app;