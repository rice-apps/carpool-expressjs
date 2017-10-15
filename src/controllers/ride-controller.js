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
   //'find' returns all objects matching the given query - all objects match the empty query "{}"
   // Most db operations take a function as their second argument, which is called after the query completes. This
   // function executes after the operation finishes - if there's an error, the first argument (err) is true. If not,
   // the second argument (rides) contains our results.
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

