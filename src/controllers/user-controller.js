var _ = require('underscore');

var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var bodyParser = require('body-parser');

var Ride = require('../models/ride');
var User = require('../models/user');
var authMiddleWare = require('../middleware/auth-middleware');

router.use(bodyParser.json());
router.use(authMiddleWare);


if(process.env.NODE_ENV !== 'test') {
    router.use(authMiddleWare);
    console.log(process.env.NODE_ENV);
}

router.get('/:username', (req, res) => {
    User.findOne({username: req.params.username}, (err, user) => {
        if(err) return res.status(500);
        if(!res || user === null) return res.status(404).send("404");
        res.status(200).send(user);
    });
});

router.post('/', (req, res) => {
    User.findOne({username: req.query.username}, (err, user) => {
        if(err) return res.status(500);
        if(!res) return res.status(404);
        if(user) return res.status(403).send("403");
        User.create({
            username: req.query.username,
            first_name: req.query.first_name || req.query.username,
            last_name:  req.query.last_name || "",
            email:  req.query.email || req.query.username + '@rice.edu',
            phone:  req.query.phone || ""
        }, (err, user) => {
            if(err) return res.status(500);
            res.status(200).send(user);
        });
    });
});

router.delete('/:username', (req, res) => {
    User.findOne({username: req.params.username}, (err, user) => {
        if(err) return res.status(500);
        if(!res) return res.status(404);

        User.remove({
            _id:    user._id
        }, () => {
            if(err) return res.status(500);
            res.status(200).send(user);
        });
    });
});

router.put('/:username', (req, res) => {
    User.findOne({username: req.params.username}, (err, user) => {

        if (req.userData.username !== req.params.username) {
            return res.status(401).send();
        }

        if (err) {
            return res.status(500).send();
        }

        if (!user) {
            return res.status(404).send();
        }

        user = _.extend(user, req.user);
        user.save(function (err, usr) {
            res.status(200).send(usr);
        });

    })




})

module.exports = router;
