const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');
const moment = require('moment');

const Ride = require('../models/ride');
const authMiddleWare = require('../middleware/auth-middleware');

const inTimeRange = (time, target, tolerance) => Math.abs(time - target) <= tolerance;
const inFuture = (time, target) => time - target >= 0;

// on this day - within 24 hours
const onThisDay = (time, target, tolerance) => time - target <= tolerance;

router.use(bodyParser.json());

// if (process.env.NODE_ENV !== 'test') {
//   router.use(authMiddleWare);
// }
router.use(authMiddleWare);

router.get('/', (req, res) => {
  const query = {};
  if (req.query.departing_from) query.departing_from = req.query.departing_from;
  if (req.query.arriving_at) query.arriving_at = req.query.arriving_at;

  // If departure_time is provided, provide rides occurring within 30 minutes.
  if (req.query.departure_time) {
    const target = new Date(req.query.departure_time).getTime();
    // The query below is for leaving within 30 minutes of the given time.
  //  query.departing_datetime = { $gte: target - 1800000, $lte: target + 1800000};

   // The query below is for leaving on day provided (the input date-time was a chosen date at 12 am).
     query.departing_datetime = {  $gte: target, $lte: target + 86400000};
  }

  // else, only filter out past rides.
  else {
    const currentTime = new Date().getTime();
    query.departing_datetime = { $gte: currentTime};
  }

  var finalQuery = Ride.find(query).sort({departing_datetime : 1});
  finalQuery.exec( (err, rides) => {
    console.log("All rides: " + rides);

    if (err) {
      return res.status(500);
    }

    return res.status(200).send(rides);

  });
});

module.exports = router;
