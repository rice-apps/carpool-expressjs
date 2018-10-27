const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');
const moment = require('moment');

const Ride = require('../models/ride');
const authMiddleWare = require('../middleware/auth-middleware');

const inTimeRange = (time, target, tolerance) => {
  console.log("Time: " + time);
  console.log("Target: " + target);
  if ( Math.abs(time - target) <= tolerance) {
    console.log("a match!!!");
    return true;
  }
  return false;

};

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
    if (err) {
      return res.status(500);
    }

    if (req.query.departure_time) {


      const target = new Date(req.query.departure_time).getTime();


      return res.status(200).send(rides.filter(ride => inTimeRange(new Date(ride.departing_datetime).getTime(), target, 1800000))); // 30 min tol
    }
    return res.status(200).send(rides);
  });
});

module.exports = router;
