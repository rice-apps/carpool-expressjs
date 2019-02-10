const express = require('express');
const jwt = require('jsonwebtoken');

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
  // 'find' returns all objects matching the given query - and all objects match the empty query "{}".

  // Most db operations take a function as their second argument, which is called after the query completes. This
  // function executes after the operation finishes - if there's an error, the first argument (err) is true. If not,
  // the second argument (rides) contains our results.
  Ride.find({}, (err, rides) => {
    if (err) {
      return response.status(500); // db error (500 internal server error)
    }
    if (!rides) {
      return response.status(404); // not found (404 not found)
    }
    response.status(200).send(rides); // success - send the rides!
  });
});

/**
 * Get a single ride
 */
router.get('/:ride_id', (req, res) => {
  Ride.findById(req.params.ride_id, (err, ride) => {
    if (err) res.status(500);
    if (!ride) res.status(404);
    res.status(200).send(ride);
  });
});

/**
 * Get all past rides
 */
router.get('/past/all/', (req, res) => {
  // TODO: figure out query & comparison time

  pastrides((err, rides) => {
    if (err) {
      console.log('Getting past rides: db error 500');
      return res.status(500); // db error (500 internal server error)
    }
    if (!rides) {
      console.log('Getting past rides: not found 404');
      return res.staus(404); // not found (404 not found)
    }
    console.log('Getting past rides: rides round D:<');
    res.status(200).send(rides);
  });
});

/**
 * Helper function to get past rides
 * @param callback
 */
function pastrides(callback) {
  const currentTime = Date.now();
  Ride.find({ departing_datetime: { $lt: currentTime } }, (err, rides) => {
    callback(err, rides);
  });
}

/**
 * Get all past rides for a specific user.
 */
router.get('/past/user/:user_id', (req, res) => {
  const currentTime = new Date().getTime();

  console.log(`Getting all past rides for user ${req.params.user_id}`);

  if (req.params.user_id === 'null' || req.params.user_id === 'undefined') {
    console.log('Invalid user_id format');
    return res.status(404).send('Invalid user_id format');
  }

  User.findById(req.params.user_id, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(500); // db error (500 internal server error)
    }
    if (!user) {
      console.log(`Could not find user with id ${req.params.user_id}`);
      return res.status(404).send('Could not find user by ID.');
    }

    // currentuser is an ARRAY containing one element - the user object.
    const currentuser = user;

    // find all rides whose "riders" array contains all the elements in the "currentuser" array - technically
    // only one user.
    const query = { $and: [{ riders: { $all: currentuser } }, { departing_datetime: { $lt: currentTime } }] };

    Ride.find(query, (err, rides) => {

      if (err) {
        return res.status(500); // db error (500 internal server error)
      }
      if (!rides) {
        return res.status(404); // not found (404 not found)
      }
      res.status(200).send(rides);
    });
  });
});

/**
 * Get all rides occurring in the future
 */
router.get('/future/all/', (req, res) => {
  // TODO: figure out query & comparison time

  futurerides((err, rides) => {
    if (err) {
      return res.status(500); // db error (500 internal server error)
    }
    if (!rides) {
      return res.staus(404); // not found (404 not found)
    }
    res.status(200).send(rides);
  });
});

/**
 * Get all future rides
 * @param callback
 */
function futurerides(callback) {
  const currentTime = Date.now();
  Ride.find({ departing_datetime: { $gte: currentTime } }, (err, rides) => {
    callback(err, rides);
  });
}

/**
 * Get all future rides for a specific user
 */
router.get('/future/user/:user_id', (req, res) => {
  const currentTime = new Date().getTime();

  console.log(`Getting all future rides for user ${req.params.user_id}`);

  if (req.params.user_id === 'null' || req.params.user_id === 'undefined') {
    console.log('Invalid user_id format');
    return res.status(404).send('Invalid user_id format');
  }

  User.findById(req.params.user_id, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(500); // db error (500 internal server error)
    }
    if (!user) {
      console.log(`Could not find user with id ${req.params.user_id}`);
      return res.status(404).send('Could not find user by ID.');
    }

    // currentuser is an ARRAY containing one element - the user object.
    const currentuser = user;

    // find all rides whose "riders" array contains all the elements in the "currentuser" array - technically
    // only one user.
    const query = { $and: [{ riders: { $all: currentuser } }, { departing_datetime: { $gte: currentTime } }] };

    Ride.find(query, (err, rides) => {
      if (err) {
        return res.status(500); // db error (500 internal server error)
      }
      if (!rides) {
        return res.status(404); // not found (404 not found)
      }
      res.status(200).send(rides);
    });
  });
});

/**
 * Get all rides containing the user
 */
router.get('/user/:user', (req, res) => {
  const currentTime = new Date().getTime();

  User.find({ username: req.params.user }, (err, user) => {
    if (err) {
      return res.status(500); // db error (500 internal server error)
    }

    // currentuser is an ARRAY containing one element - the user object.
    const currentuser = user;

    // find all rides whose "riders" array contains all the elements in the "currentuser" array - technically
    // only one user.
    const query = { riders: { $all: currentuser } };

    Ride.find(query, (err, rides) => {
      console.log('Rides', rides);

      if (err) {
        return res.status(500); // db error (500 internal server error)
      }
      if (!rides) {
        return res.status(404); // not found (404 not found)
      }
      res.status(200).send(rides);
    });
  });
});

/**
 * Post a single ride.
 */
router.post('/', (req, res) => {
  console.log(`Creating a new ride with user ${req.body.user_id}`);

  if (req.params.user_id === 'null' || req.params.user_id === 'undefined') {
    console.log('Invalid user_id format');
    return res.status(404).send('Invalid user_id format');
  }

  User.findById(req.body.user_id, (err, user) => {
    if (err) {
      console.log(err);
      res.status(500).send();
    }
    if (!user) {
      console.log(`Could not find user with id ${req.body.user_id}`);
      return res.status(404).send('Could not find user by ID.');
    }

    Ride.create({
      departing_datetime: req.body.ride.departing_datetime,
      arriving_at: req.body.ride.arriving_at,
      departing_from: req.body.ride.departing_from,
      number_riders: req.body.ride.number_riders,
      riders: [user._id],
    }, (err, ride) => {
      if (err) return res.status(500).send();
      res.status(200).send(ride);
    });
  });
});

/**
 * Post a user to a ride.
 */
router.post('/:ride_id/book', (req, res) => {
  console.log(`Posting user with id ${req.body.user_id} to ride with id ${req.params.ride_id}`);

  if (req.params.user_id === 'null' || req.params.user_id === 'undefined') {
    console.log('Invalid user_id format');
    return res.status(404).send('Invalid user_id format');
  }

  if (!req.body.user_id) {
    console.log('A user id was not provided');
    return res.status(404).send('A user must be provided.');
  }

  User.findById(req.body.user_id, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Internal Error');
    }
    if (!user) {
      console.log(`Could not find user with id ${req.body.user_id}`);
      return res.status(404).send('Could not find user by ID.');
    }

    Ride.findById(req.params.ride_id, (rideErr, ride) => {
      if (rideErr) {
        console.log(rideErr);
        return res.status(500).send('Internal Error');
      }
      if (!ride) {
        console.log(`Could not find ride with id ${req.params.ride_id}`);
        return res.status(404).send('Could not find ride by ID');
      }

      console.log(ride.riders);
      if (includes(ride.riders, user._id)) {
        console.log('User already exists on ride');
        return res.status(403).send('User exists on ride');
      } else {
        ride.riders.push(user);
        const newRiders = ride.riders;
        ride.set({ riders: newRiders });
        ride.save((saveErr, newRide) => {
          if (saveErr) {
            console.log(saveErr);
            return res.status(500).send('Error saving user into ride');
          }
          return res.status(200).send(newRide);
        });
      }
    });
  });
});

/**
 * Delete a user from a ride.
 */
router.delete('/:ride_id/:user_id', (req, res) => {
  if (req.params.user_id === 'null' || req.params.user_id === 'undefined') {
    console.log('Invalid user_id format');
    return res.status(404).send('Invalid user_id format');
  }

  // Get the ride
  Ride.findById(req.params.ride_id, (err, ride) => {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Error');
    }
    if (!ride) {
      console.log(`Could not find ride with id ${req.params.ride_id}`);
      return res.status(404).send('Could not find ride by ID');
    }

    // If this ride is already empty - delete it. It should not be in this kind of state.
    if (ride.riders && !ride.riders.length) {
      deleteRide(req.params.ride_id, (err, res) => {
        if (err) { return res.status(500).send(); }
        console.log('ride ', req.params.ride_id, ' was already empty and successfully deleted');
      });
    }

    // Check if the user is part of this ride
    // Remove the user from this ride
    console.log(req.params.user_id);
    console.log(ride.riders);
    if (ride.riders.some(r => r._id.toString() === req.params.user_id.toString())) {

      ride.riders = ride.riders.filter(ele => ele._id.toString() !== req.params.user_id.toString());
      console.log('removed user id ', req.params.user_id, 'from ride', req.params.ride_id);

      // If this ride has no users - delete it
      if (ride.riders && ride.riders.length === 0) {
        deleteRide(req.params.ride_id, (err, res) => {
          if (err) { return res.status(500).send(); }
          console.log('ride ', req.params.ride_id, ' is now empty and successfully deleted');
        });
      }

      // Write the changes to the database
      ride.save((saveErr) => {
        if (saveErr) return res.status(500).send();
        return res.status(200).send(ride);
      });
    } else {
      console.log('User does not exist on this ride!');
      return res.status(404).send('User does not exist on ride!');
    }
  });
});

/**
 * Endpoint Delete a ride.
 */
router.delete('/:ride_id', (req, res) => {
  console.log('deleting ride ', req.params.ride_id);
  deleteRide(req.params.ride_id, (err, ride) => {
    if (err) { return res.status(500).send(); }
    console.log('ride ', req.params.ride_id, ' was successfully deleted');
    ride.status(200).send(ride);
  });
});

/**
 * Delete a ride
 */
function deleteRide(ride_id, callback) {
  const myquery = { _id: ride_id };
  Ride.deleteOne(myquery, (err, ride) => {
    callback(err, ride);
  });
}

module.exports = router;
