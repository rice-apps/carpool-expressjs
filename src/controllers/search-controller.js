const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');
const moment = require('moment');

const Ride = require('../models/ride');
const authMiddleWare = require('../middleware/auth-middleware');

const inTimeRange = (time, target, tolerance) => Math.abs(time - target) <= tolerance;
const inFuture = (time, target) => time - target >= 0;

router.use(bodyParser.json());

// if (process.env.NODE_ENV !== 'test') {
//   router.use(authMiddleWare);
// }
router.use(authMiddleWare);

router.get('/', (req, res) => {
  const query = {};
  if (req.query.departing_from) query.departing_from = req.query.departing_from;
  if (req.query.arriving_at) query.arriving_at = req.query.arriving_at;

  Ride.find(query, (err, rides) => {
    console.log("All rides: " + rides);

    if (err) {
      return res.status(500);
    }
    // If a departure_time is provided, only return rides within 30 minutes of it.
    if (req.query.departure_time) {
      const target = new Date(req.query.departure_time).getTime();

      return res.status(200).send(rides.filter(ride => inTimeRange(new Date(ride.departing_datetime).getTime(), target, 1800000))); // 30 min tol
    }

    // Otherwise, only filter out rides that are in the future.
    const currentTime = Date.now();
    return res.status(200).send(rides.filter(ride => inFuture(new Date(ride.departing_datetime).getTime(), currentTime)));
  });
});

module.exports = router;
