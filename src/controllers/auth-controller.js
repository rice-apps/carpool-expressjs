var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var request = require('request');
var xmlParser = require('xml2js').parseString;
var stripPrefix = require('xml2js').processors.stripPrefix;

var config = require('../config');

var User = require('../models/user');

router.use(bodyParser.json());

/**
 * After the browser is redirected by the IDP, the frontend takes the ticket off the URL and sends a GET
 * request to the backend, here, with the ticket as a query parameter. Here, we validate the ticket against
 * the CAS server and then parse the response to see if we succeeded, and let the frontend know.
 */
router.get('/', function (req, res) {

  var ticket = req.query.ticket;

  if (ticket) {
    // validate our ticket against the CAS server
      //serviceURL = localhost:4200
    var url = `${config.CASValidateURL}?ticket=${ticket}&service=${config.thisServiceURL}`;
    request(url, function (err, response, body) {

      if (err) return res.status(500);

      // parse the XML.
      // notice the second argument - it's an object of options for the parser, one to strip the namespace
      // prefix off of tags and another to prevent the parser from creating 1-element arrays.
      xmlParser(body, {tagNameProcessors: [stripPrefix], explicitArray: false}, function (err, result) {
        if (err) return res.status(500);

        serviceResponse = result.serviceResponse;

        var authSucceded = serviceResponse.authenticationSuccess;
        if (authSucceded) {
          // here, we create a token with the user's info as its payload.
          // authSucceded contains: { user: <username>, attributes: <attributes>}
          var token = jwt.sign({data: authSucceded}, config.secret);

          // see if this netID exists as a user already. if not, create one.
          User.findOne({username: authSucceded.user}, function (err, user) {
            var newUserCheck = null;
            var userId = null;
            if (err) {
              console.log(err);
              return res.status(500).send('Internal Error');
            }

            if (!user) {
              User.create({
                username: authSucceded.user,
                email: authSucceded.user + '@rice.edu'
              }, function (err, newUser) {
                if (err) return res.status(500).send();
                console.log('new user', newUser);
                newUserCheck = true;
                console.log('new user?',newUserCheck)
                userId = newUser._id;
              });
              newUserCheck = true;
            } else {
              newUserCheck = false;
              userId = user._id;
            }
            console.log("new user id", userId);

            // send our token to the frontend! now, whenever the user tries to access a resource, we check their
            // token by verifying it and seeing if the payload (the username) allows this user to access
            // the requested resource.
            res.json({
              success: true,
              message: 'CAS authentication success',
              isNew: newUserCheck,
              user: {
                _id: userId,
                token: token
              }
            });
            return res.status(200);
          });

        } else if (serviceResponse.authenticationFailure) {
          return res.status(401).json({ success: false, message: 'CAS authentication failed'});
        } else {
          return res.status(500).send();
        }
      })
    })
  } else {
    return res.status(400);
  }
});





module.exports = router;
