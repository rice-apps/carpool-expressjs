const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const request = require('request');
const xmlParser = require('xml2js').parseString;
const { stripPrefix } = require('xml2js').processors;

const config = require('../config');

const User = require('../models/user');

router.use(bodyParser.json());

/**
 * After the browser is redirected by the IDP, the frontend takes the ticket off the URL and sends a
 * GET request to the backend, here, with the ticket as a query parameter. Here, we validate the
 * ticket against the CAS server and then parse the response to see if we succeeded, and let the
 * frontend know.
 */
router.get('/', (req, res) => {
  const { ticket } = req.query;

  if (ticket) {
    // validate our ticket against the CAS server
    const url = `${config.CASValidateURL}?ticket=${ticket}&service=${config.thisServiceURL}`;
    request(url, (err, response, body) => {
      if (err) return res.status(500);
      /**
       * parse the XML. notice the second argument - it's an object of options for the parser,
       * one to strip the namespace prefix off of tags and another to prevent the parser from
       * creating 1-element arrays.
       */
      xmlParser(body, {
        tagNameProcessors: [stripPrefix],
        explicitArray: false,
      }, (parseErr, result) => {
        if (parseErr) return res.status(500);

        const { serviceResponse } = result;

        const authSucceded = serviceResponse.authenticationSuccess;
        if (authSucceded) {
          // here, we create a token with the user's info as its payload.
          // authSucceded contains: { user: <username>, attributes: <attributes>}
          const token = jwt.sign({ data: authSucceded }, config.secret);

          // see if this netID exists as a user already. if not, create one.
          User.findOne({ username: authSucceded.user }, (findErr, user) => {
            if (findErr) return res.status(500);
            if (!user) {
              User.create({
                username: authSucceded.user,
                first_name: authSucceded.user,
                email: `${authSucceded.user}@rice.edu`,
              }, (createErr, newUser) => {
                if (createErr) return res.status(500);
                return newUser;
              });
            }
            return user;
          });
          /**
           * send our token to the frontend! now, whenever the user tries to access a resource,
           * we check their token by verifying it and seeing if the payload (the username)
           * allows this user to access the requested resource.
           */
          return res.json({
            success: true,
            message: 'CAS authentication success',
            user: {
              username: authSucceded.user,
              token,
            },
          });
        } else if (serviceResponse.authenticationFailure) {
          return res.status(401).json({ success: false, message: 'CAS authentication failed' });
        }

        return res.status(500);
      });
      return response;
    });
    return ticket;
  }
  return res.status(400);
});

module.exports = router;
