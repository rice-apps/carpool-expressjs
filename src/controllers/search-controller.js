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

router.get('/', function(req,res){
    const query = new Object();
    if(req.query.departing_from) query.departing_from = req.query.departing_from;
    if(req.query.arriving_at) query.arriving_at = req.query.arriving_at;
    if(req.query.departure_time) query.departure_time = new Date(req.query.departure_time);

    Ride.find(query, function(err, rides) {
        if(err) {
            return res.status(500);
        }
        if(!rides) {
            return res.status(404);
        }
        res.status(200).send(rides);
    });
});

module.exports = router;