var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var bodyParser = require('body-parser');
var moment = require('moment');

var Ride = require('../models/ride');
var authMiddleWare = require('../middleware/auth-middleware');

router.use(bodyParser.json());

if(process.env.NODE_ENV !== 'test') {
    router.use(authMiddleWare);
    console.log(process.env.NODE_ENV);
}

router.get('/', function(req,res){

    const query = new Object();
    if(req.query.departing_from) query.departing_from = req.query.departing_from;
    if(req.query.arriving_at) query.arriving_at = req.query.arriving_at;

    if(req.query.departure_time) {
        let allRides = [];
        query.departure_time = moment(req.query.departure_time).toDate();

        Ride.find(query, function(err, rides) {
            if(err) {
                return res.status(500);
            }
            if(!rides) {
                return res.status(404);
            }
            console.log(rides);
            allRides = allRides.concat(rides);
            console.log(allRides);

            query.departure_time = moment(req.query.departure_time).add(30, 'm').toDate();

            Ride.find(query, function(err, rides) {
                if(err) {
                    return res.status(500);
                }
                if(!rides) {
                    return res.status(404);
                }
                allRides = allRides.concat(rides);
                query.departure_time = moment(req.query.departure_time).subtract(30, 'm').toDate();

                Ride.find(query, function(err, rides) {
                    if(err) {
                        return res.status(500);
                    }
                    if(!rides) {
                        return res.status(404);
                    }
                    allRides = allRides.concat(rides);
                    res.status(201).send(allRides);
                });
            });
        });
    }
    else {
        Ride.find(query, function (err, rides) {
            if (err) {
                return res.status(500);
            }
            if (!rides) {
                return res.status(404);
            }
            res.status(200).send(rides);
        });
    }
});

module.exports = router;