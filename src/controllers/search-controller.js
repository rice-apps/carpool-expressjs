const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');
const moment = require('moment');

const Ride = require('../models/ride');
const authMiddleWare = require('../middleware/auth-middleware');

router.use(bodyParser.json());

if (process.env.NODE_ENV !== 'test') {
  router.use(authMiddleWare);
}

router.get('/', (req, res) => {
  const query = {};
  if (req.query.departing_from) query.departing_from = req.query.departing_from;
  if (req.query.arriving_at) query.arriving_at = req.query.arriving_at;

  if (req.query.departure_time) {
    let allRides = [];
    query.departure_time = moment(req.query.departure_time).toDate();

    Ride.find(query, (err, rides) => {
      if (err) {
        return res.status(500);
      }
      if (!rides) {
        return res.status(404);
      }

      allRides = allRides.concat(rides);

      query.departure_time = moment(req.query.departure_time).add(30, 'm').toDate();

      Ride.find(query, (futureErr, futureRides) => {
        if (futureErr) {
          return res.status(500);
        }
        if (!futureRides) {
          return res.status(404);
        }
        allRides = allRides.concat(futureRides);

        query.departure_time = moment(req.query.departure_time).subtract(30, 'm').toDate();

        Ride.find(query, (pastErr, pastRides) => {
          if (pastErr) {
            return res.status(500);
          }
          if (!pastRides) {
            return res.status(404);
          }
          allRides = allRides.concat(pastRides);

          return res.status(200).send(allRides);
        });
        return 0;
      });
      return 0;
    });
  } else {
    Ride.find(query, (err, rides) => {
      if (err) {
        return res.status(500);
      }
      if (!rides) {
        return res.status(404);
      }
      return res.status(200).send(rides);
    });
  }
});

module.exports = router;
