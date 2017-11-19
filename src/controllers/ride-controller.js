var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var bodyParser = require('body-parser');

var Ride = require('../models/ride');
var User = require('../models/user');
var authMiddleWare = require('../middleware/auth-middleware');

router.use(bodyParser.json());

if(process.env.NODE_ENV !== 'test') {
    router.use(authMiddleWare);
    console.log(process.env.NODE_ENV);
}

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

router.get('/:ride_id', function (req, res) {
   Ride.findById(req.params.ride_id, function (err, ride) {
       if (err) res.status(500);
       if (!ride) res.status(404);
       res.status(200).send(ride);
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

/**
 * Post a user to a ride.
 */
router.post('/:ride_id/book', function (req, res) {
   User.findOne({ username: req.userData.user }, function (err, user) {
       if (err) res.status(500).send();
       if (!user) res.status(404).send();
       Ride.findById(req.params.ride_id, function (err, ride) {
           if (err) res.status(500).send();

           if (includes(ride.riders, user.username)) {
               res.status(403).send("User exists on ride");
           } else {
               ride.riders.push(user);
               ride.save(function (err, newRide) {
                   if (err) res.status(500).send();
                   res.status(200).send(newRide);
               });
           }
       })
   })
});

var includes = function (array, username) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].username === username) return true;
    }
    return false;
};

/**
 * delete a user from a ride
 */
router.post('/:ride_id/deletebook', function (req, res) {
    User.findOne({ username: req.userData.user }, function (err, user) {
        if (err) res.status(500).send();
        if (!user) res.status(404).send();
        Ride.findById(req.params.ride_id, function (err, ride) {
            if (err) res.status(500).send();
            if (includes(ride.riders, user.username)) {

                for (i = 0; i <ride.riders.length; i++){
                    if (ride.riders[i].username === user.username) {
                        ride.riders.splice(i,1);
                    }
                }
                ride.save(function (err, deleteRide) {
                    if (err) res.status(500).send();
                    res.status(200).send(deleteRide);
                });

            } else {
                res.status(403).send("User doesn't exist");
            }
        })
    })
});

module.exports = router;