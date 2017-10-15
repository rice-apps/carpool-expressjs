var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var bodyParser = require('body-parser');

var Ride = require('../models/ride');

router.use(bodyParser.json());

/**
 * Returns all rides.
 */
router.get('/', function (request, response) {
   Ride.find({}, function (err, rides) {
       if (err) {
           return response.status(500); // db error (500 internal server error)
       }
       if (!ride) {
           return response.status(404); // no rides found (404 not found)
       }
       response.status(200).send(rides);
   })
});

