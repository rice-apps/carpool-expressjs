var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var bodyParser = require('body-parser');

var Ride = require('../models/ride');
var User = require('../models/user');
var authMiddleWare = require('../middleware/auth-middleware');

router.use(bodyParser.json());

// if (process.env.NODE_ENV !== 'test') {
//   router.use(authMiddleWare);
// }

router.use(authMiddleWare);

const includes = (array, username) => {
  for (let i = 0; i < array.length; i += 1) {
    if (array[i].username === username) return true;
  }
  return false;
};


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
  User.findOne({username: req.userData.user}, function (err, user) {
    if (err) res.status(500).send();
    if (!user) res.status(404).send();
    Ride.create({
      departing_datetime: req.body.departing_datetime,
      arriving_at: req.body.arriving_at,
      meeting_at: req.body.meeting_at,
      departing_from: req.body.departing_from,
      riders: [user._id]
    }, function (err, ride) {
      if (err) return res.status(500).send();
      res.status(200).send(ride);
    });
  })


});

/**
 * Post a user to a ride.
 */
router.post('/:ride_id/book', function (req, res) {
  User.findOne({username: req.userData.user}, function (err, user) {
    if (err) {
        // console.log("500 error for finding user: " + err)
        res.status(500).send()
    };
    if (!user) res.status(404).send();
    Ride.findById(req.params.ride_id, function (err, ride) {
        if (err) {
            // console.log("500 error for finding ride: " + err)
            res.status(500).send()
        };
      if (includes(ride.riders, user.username)) {
        res.status(403).send("User exists on ride");
      } else {
          //console.log("this is what riders look like: "+ride.riders)
          //console.log("this is what the new rider look like: " + user)
          ride.riders.push(user);
          //console.log("this is what new riders look like:" + ride.riders)
          let newRiders = ride.riders
          ride.set({riders: newRiders})
        ride.save(function (err, newRide) {
            if (err) {
                console.log("500 error for saving ride: " + err)
                res.status(500).send()
            };
            res.status(200).send(newRide);
        });
      }
    })
  })
});

/**
 * Delete a user from a ride.
 */
router.delete('/:ride_id/:user_id', function (req, res) {
    /** TODO: check if ride has 0 riders, if yes then delete. */
  if (req.userData.user === req.params.user_id) {
    Ride.findById(req.params.ride_id, function (err, ride) {
        if (err) res.status(500).send();
        if (includes(ride.riders, req.userData.user)) {
            ride.riders = ride.riders.filter(ele => ele.username!==req.userData.user);
            ride.save(function (err) {
              if (err) return res.status(500).send();
              return res.status(200).send(ride);
            });
        } else {
            return res.status(404).send("User does not exist on ride!");
        }
    });
  } else {
    return res.status(403).send();
  }
});

module.exports = router;