const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');

const Ride = require('../models/ride');
const User = require('../models/user');
const authMiddleWare = require('../middleware/auth-middleware');

router.use(bodyParser.json());

if (process.env.NODE_ENV !== 'test') {
  router.use(authMiddleWare);
}

const includes = (array, username) => {
  for (let i = 0; i < array.length; i += 1) {
    if (array[i].username === username) return true;
  }
  return false;
};


/**
 * Returns all rides.
 */
router.get('/', (request, response) => {
  /*
  'find' returns all objects matching the given query - and all objects match the empty query "{}".

  Most db operations take a function as their second argument, which is called after the query
  completes. This function executes after the operation finishes - if there's an error, the first
  argument (err) is true. If not, the second argument (rides) contains our results.
  */

  Ride.find({}, (err, rides) => {
    if (err) {
      return response.status(500); // db error (500 internal server error)
    }
    if (!rides) {
      return response.status(404); // not found (404 not found)
    }
    return response.status(200).send(rides); // success - send the rides!
  });
});

router.get('/:ride_id', (req, res) => {
  Ride.findById(req.params.ride_id, (err, ride) => {
    if (err) res.status(500);
    if (!ride) res.status(404);
    res.status(200).send(ride);
  });
});

/**
 * Post a single ride.
 */
router.post('/', (req, res) => {
  // grab the username out of the request and find that user in the database
  User.findOne({ username: req.userData.user }, (err, thisUser) => {
    if (err) return res.status(500);
    if (!thisUser) return res.status(401);
    Ride.create({
      riders: [thisUser],
    }, (mongooseErr, ride) => {
      if (mongooseErr) return res.status(500);
      return res.status(200).send(ride);
    });

    return res.status(501);
  });
});

/**
 * Post a user to a ride.
 */
router.post('/:ride_id/book', (req, res) => {
  User.findOne({ username: req.userData.user }, (err, user) => {
    if (err) res.status(500).send();
    if (!user) res.status(404).send();
    Ride.findById(req.params.ride_id, (findErr, ride) => {
      if (findErr) res.status(500).send();

      if (includes(ride.riders, user.username)) {
        res.status(403).send('User exists on ride');
      } else {
        ride.riders.push(user);
        ride.save((saveErr, newRide) => {
          if (saveErr) res.status(500).send();
          res.status(200).send(newRide);
        });
      }
    });
  });
});


module.exports = router;
