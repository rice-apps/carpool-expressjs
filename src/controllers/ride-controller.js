var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var bodyParser = require('body-parser');

var Ride = require('../models/ride');
var User = require('../models/user');
var authMiddleWare = require('../middleware/auth-middleware');

router.use(bodyParser.json());

/* Use our auth checker to stash identity data in the request before we process it */
router.use(authMiddleWare);

/**
 * Returns all rides.
 */
router.get('/', function (request, response) {
   //'find' returns all objects matching the given query - and all objects match the empty query "{}".

   // Most db operations take a function as their second argument, which is called after the query completes. This
   // function executes after the operation finishes - if there's an error, the first argument (err) is true. If not,
   // the second argument (rides) contains our results.
   Ride.find({}, function (err, rides) {
       if (err) {
           return response.status(500); // db error (500 internal server error)
       }
       if (!rides) {
           return response.status(404); // not found (404 not found)
       }
       response.status(200).send(rides); // success - send the rides!
   })
});

/**
 * Post a single ride.
 */
router.post('/', function (req, res) {
    // grab the username out of the request and find that user in the database
    User.findOne({ username: req.userData.user }, function (err, thisUser) {
        if (err) return res.status(500);
        if (!user) return res.status(401);
        Ride.create({
            title: req.body.title,
            description: req.body.description,
            owner: thisUser
        }, function (err, ride) {
            if (err) return res.status(500);
            res.status(200).send(ride);
        });
    });
});

module.exports = router;
