const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const bodyParser = require('body-parser');

const Ride = require('../models/ride');
const User = require('../models/user');
const authMiddleWare = require('../middleware/auth-middleware');

const nodemailer = require('nodemailer');

var mongoose = require('mongoose');
var Agenda = require('agenda');
const config = require('../config');
const mongoConnectionString = config.db_uri;
// printing out config.db_uri: mongodb://carpool2018:carpool2018@ds149353.mlab.com:49353/carpool_dev

//const mongoConnectionString = mongoose.connect('mongodb://127.0.0.1/Carpool',{ useMongoClient: true });
const agenda = new Agenda({db: {address: mongoConnectionString, collection: 'jobs'}});
agenda.start();

// Job data should include: ride id
// done() --> asynchronous
agenda.define('send future email', (job, done) => {
   // const {to} = job.attrs.data;
    console.log('are these the emails? %s', job.attrs.data.to);
    createEmailReminderJob(job.attrs.data);
    done();
});

agenda.on('start', job => {
    console.log('Job \"%s\" starting with id %s and email %s', job.attrs.name, job.attrs.data.ride_id, job.attrs.data.to);
});
agenda.on('complete', job => {
    //console.log(`Job ${job.attrs.name} finished`);
});
agenda.on('success:send future email', job => {
    console.log(`Sent Email Successfully`);
});
agenda.on('fail:send future email', (err, job) => {
    console.log('Job failed with error: ${err.message}');
});

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

router.get('/:ride_id', (req, res) => {
    console.log('/get_ride');
    //console.log(req);
    Ride.findById(req.params.ride_id, (err, ride) => {
        if (err) res.status(500);
        if (!ride) res.status(404);
        res.status(200).send(ride);
    });
});

function pastrides(callback) {
    const currentTime = Date.now();
    Ride.find({ departing_datetime: { $lt: currentTime } }, (err, rides) => {
        callback(err, rides);
    });
}

/*
  Get all past rides.
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

/*
    Get all past rides for a specific user
 */

router.get('/past/user/:user', (req, res) => {

    const currentTime = new Date().getTime();

    User.find({ username: req.params.user }, (err, user) => {
        if (err) {
            return res.status(500); // db error (500 internal server error)
        }

        // currentuser is an ARRAY containing one element - the user object.
        const currentuser = user;

        // find all rides whose "riders" array contains all the elements in the "currentuser" array - technically
        // only one user.
        const query = { $and: [{ riders: { $all: currentuser } }, { departing_datetime: { $lt: currentTime } }] };

        Ride.find(query, (err, rides) => {
            //console.log('Rides', rides);

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

function futurerides(callback) {
    const currentTime = Date.now();
    Ride.find({ departing_datetime: { $gte: currentTime } }, (err, rides) => {
        callback(err, rides);
    });
}

/*
  Get all rides occurring in the future.
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

/*
    Get all future rides for a specific user.
 */
router.get('/future/user/:user', (req, res) => {
    const currentTime = new Date().getTime();

    User.find({ username: req.params.user }, (err, user) => {
        if (err) {
            return res.status(500); // db error (500 internal server error)
        }

        // currentuser is an ARRAY containing one element - the user object.
        const currentuser = user;

        // find all rides whose "riders" array contains all the elements in the "currentuser" array - technically
        // only one user.
        const query = { $and: [{ riders: { $all: currentuser } }, { departing_datetime: { $gte: currentTime } }] };

        Ride.find(query, (err, rides) => {
            //console.log('Rides', rides);

            if (err) {
                return res.status(500); // db error (500 internal server error)
            }
            if (!rides) {
                return res.status(404); // not found (404 not found)
            }
            console.log("Umm incoming job happening?!");
            agenda.schedule('in 1 minute', 'send future email', {ride_id: "RIDE ID", to: ['alh9@rice.edu']});
            updateJob(1, "hwangangela99@hotmail.com", {ride_id: "RIDE ID", to: ['alh9@rice.edu']}, "in 1 minute");
            res.status(200).send(rides);
        });
    });
});

/*
  Get all rides containing the user.
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
            //console.log('Rides', rides);

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
    console.log(req.body);
    User.findOne({ username: req.body.username }, (err, user) => {
        if (err) res.status(500).send();
        if (!user) res.status(404).send();

        console.log(req.body);

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
 * Updates a the mailing list and timing of a job.
 * @param add: boolean representing whether the email should be added to the mailing list
 * @param email: email address string
 * @param data: data object whose "to" field is to be modified
 * @param when: time to schedule the future email
 */
function updateJob(add, email, data, when) {
    if (add) {
        data.to.push(email); // formerly .push(user)... mistake @josie ?
    } else {
        data.to.filter(sendtoMe => sendtoMe!=email)
    }
    agenda.cancel({ride_id: 'RIDE ID'}, (err, numRemoved) => {
        if (err) {
            // console.log("500 error for finding ride: " + err)
            res.status(500).send();
        }
        else {
            console.log("Number of CANCELLED jobs: " + numRemoved);
        }
    });

    agenda.schedule(when, 'send future email', data);
}

/**
 *
 * @param data: Object containing ride ID and list of riders
 */
function createEmailReminderJob(data) {
    var messageBody = '<p>Your ride is in 24 hours.</p>';

    async function main(){

        // create reusable transporter object using the default SMTP transport
        let smtpTransport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                type: 'OAuth2',
                user: 'carpool.riceapps@gmail.com', // generated ethereal user
                clientId: '859237922889-smeosvsfknkhm31sirfdt0afnspc4s64.apps.googleusercontent.com',
                clientSecret: 'aGISyb3daSQF1HFVqKFe5Nho',
                refreshToken: '1/o1N0caKIPFpdy02pn0qxgwcmpV9KbUyOEL9Jox7RmQQ',
                accessToken: 'ya29.GludBu475Z82VtLhBWgQNgkIPbVG27l1VrOeFrcrA8Cz1TWuraNc24Q2nAx2GedXezdP0qEJVF2Zw_87hHNsGlra8dJSWjEV9MfOjuOouX4Ly2k1RtENNHaTyU0v'
            }
        });

        var emailString = "";
        for (var i = 0; i < data.to.length; i ++) {
            emailString += data.to[i] + ", ";
        }
        console.log("Email Receivers: %s", emailString);

        let mailOptions = {
            from: "Rice Carpool <carpool.riceapps@gmail.com>", // sender address
            to: emailString, // list of receivers
            subject: "Your ride is in 24 hours!", // Subject line
            html: messageBody
        };

        let info = await smtpTransport.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);

    }

    main().catch(console.error);
}

function sendEmailConfirmation(ride_id, ride, rider, createdRide, joinedRide, leftRide) {

    var departingFrom = ride.departing_from;
    var arrivingAt = ride.arriving_at;
    var date = ride.departing_datetime;
    var emailString = '';
    var riderString = '<h4>Riders (' + ride.riders.length + ')</h4><ul>'
    var newRider = '';

    if (!rider.first_name)
        newRider = rider.username;

    else newRider = rider.first_name + " " + rider.last_name;

    var i;
    for (i = 0; i < ride.riders.length; i++) {
        var temp = ride.riders[i];

        // if the user is joining a ride, make sure they don't get 2 emails.
        if (temp.username !== rider.username)
            emailString += temp.email + ', ';

        // Use the full name of the rider for riders list, or the rider's username if not available.
        if (!temp.first_name)
            riderString += '<li>' + temp.username + '</li>';
        else riderString += '<li>' + temp.first_name + ' ' + temp.last_name + '</li>';
    }

    riderString += '</ul>';


    // Use the flags to determine which type of message to send.
    var subject;
    var message;
    var personalSubject;
    var personalMessage;
    var link = '\"localhost:4200/rides/' + ride_id + '\"';
    var messageBody = '<p>Departing from: ' + departingFrom + '</p>' +
        '<p>Arriving at: ' + arrivingAt + '</p>' +
        '<p>Depature time: ' + date + '</p>' +
        riderString +
        '<br/><p> To view the ride page, <a href = ' + link + '>click here</a>.</p>';

    if (createdRide) {
        subject = 'You have created a ride!';
        message = 'You have created ride ' + ride_id;
        messageBody = "<p>You will be responsible for calling an Uber/Lyft for this ride to happen. The ride's information is as follows.</p>" + messageBody;
    }

    if (joinedRide) {
        subject = 'User ' + newRider + ' has joined your ride!';
        message = '<p>User ' + newRider + ' has joined your ride. </p>';
        personalSubject = 'You have joined ride ' + ride_id + '!';
        personalMessage = 'Yay! You have joined ride ' + ride_id + '.';
    }

    if (leftRide) {
        subject = 'User ' + newRider + ' has left your ride!';
        message = '<p>User ' + newRider + ' has left your ride. </p>';
        personalSubject = 'You have left ride ' + ride_id + '!';
        personalMessage = "You have left ride " + ride_id + ". The ride's information is as follows: ";
    }

    async function main(){

        // create reusable transporter object using the default SMTP transport
        let smtpTransport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                type: 'OAuth2',
                user: 'carpool.riceapps@gmail.com', // generated ethereal user
                clientId: '859237922889-smeosvsfknkhm31sirfdt0afnspc4s64.apps.googleusercontent.com',
                clientSecret: 'aGISyb3daSQF1HFVqKFe5Nho',
                refreshToken: '1/o1N0caKIPFpdy02pn0qxgwcmpV9KbUyOEL9Jox7RmQQ',
                accessToken: 'ya29.GludBu475Z82VtLhBWgQNgkIPbVG27l1VrOeFrcrA8Cz1TWuraNc24Q2nAx2GedXezdP0qEJVF2Zw_87hHNsGlra8dJSWjEV9MfOjuOouX4Ly2k1RtENNHaTyU0v'
            }
        });

        // To all the riders on the ride
        if (! createdRide)
        {

            let mailOptions = {
                from: "Rice Carpool <carpool.riceapps@gmail.com>", // sender address
                to: emailString, // list of receivers
                subject: subject, // Subject line
                html: message + messageBody
            };

            let info = await smtpTransport.sendMail(mailOptions);
            console.log("Message sent: %s", info.messageId);
        }


        // To the user.
        let mailOptions2 = {
            from: "Rice Carpool <carpool.riceapps@gmail.com>", // sender address
            to: rider.email, // list of receivers
            subject: personalSubject, // Subject line
            html: personalMessage + messageBody
        };

        // send mail with defined transport object
        let info2 = await smtpTransport.sendMail(mailOptions2);
        console.log("Message sent to rider: %s", info2.messageId);

    }

    main().catch(console.error);
}

/**
 * Post a user to a ride.
 */
router.post('/:ride_id/book', (req, res) => {
    console.log('/book');

    User.findOne({ username: req.body.username }, (err, user) => {
        if (err) {
            // console.log("500 error for finding user: " + err)
            res.status(500).send();
        }
        if (!user) res.status(404).send();
        Ride.findById(req.params.ride_id, (err, ride) => {
            if (err) {
                // console.log("500 error for finding ride: " + err)
                res.status(500).send();
            }
            if (includes(ride.riders, user.username)) {
                res.status(403).send('User exists on ride');
            } else {
                // console.log("this is what riders look like: "+ride.riders)
                // console.log("this is what the new rider look like: " + user)
                ride.riders.push(user);
                // console.log("this is what new riders look like:" + ride.riders)
                const newRiders = ride.riders;
                ride.set({ riders: newRiders });
                ride.save((err, newRide) => {
                    if (err) {
                        console.log(`500 error for saving ride: ${err}`);
                        res.status(500).send();
                    }

                    // send email
                    agenda.now("send future email");
                    sendEmailConfirmation(req.params.ride_id, newRide, user, false,true, false);
                    res.status(200).send(newRide);
                });
            }
        });
    });
});

/**
 * Delete a user from a ride.
 */
router.delete('/:ride_id/:user_id', (req, res) => {
    // if (req.userData.user === req.params.user_id) {

    // Get the ride
    Ride.findById(req.params.ride_id, (err, ride) => {
        if (err) res.status(500).send();
        // console.log("ride:", ride);

        // If this ride is already empty - delete it
        if (ride.riders && ride.riders.length === 0) {
            deleteRide(req.params.ride_id, (err, res) => {
                if (err) { return res.status(500).send(); }
                console.log('ride ', req.params.ride_id, ' was already empty and successfully deleted');
            });
        }

        // Check if the user is part of this ride
        if (ride.riders.some(r => r.username === req.params.user_id)) {
            // Remove the user from this ride
            ride.riders = ride.riders.filter(ele => ele.username !== req.params.user_id);
            console.log('removed user id ', req.params.user_id, 'from ride', req.params.ride_id);

            // If this ride has no users - delete it
            if (ride.riders && ride.riders.length === 0) {
                deleteRide(req.params.ride_id, (err, res) => {
                    if (err) { return res.status(500).send(); }
                    console.log('ride ', req.params.ride_id, ' is now empty and successfully deleted');
                });
            }

            // Write the changes to the database
            ride.save((err) => {
                if (err) return res.status(500).send();

                User.findOne({ username: req.params.user_id }, (err, user) => {
                    if (err) {
                        // console.log("500 error for finding user: " + err)
                        res.status(500).send();
                    }
                    if (!user) res.status(404).send();

                    sendEmailConfirmation(req.params.ride_id, ride, user, false, false, true);
                });

                return res.status(200).send(ride);

            });
        } else {
            return res.status(404).send('User does not exist on ride!');
        }
    });
    // }
    // else {
    //   return res.status(403).send();
    // }
    // }
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






module.exports = router;
