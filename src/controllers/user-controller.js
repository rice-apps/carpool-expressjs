const _ = require('underscore');

const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');

const User = require('../models/user');
const authMiddleWare = require('../middleware/auth-middleware');

router.use(bodyParser.json());

if (process.env.NODE_ENV !== 'test') {
  router.use(authMiddleWare);
}
// router.use(authMiddleWare);

/**
 * Returns all users.
 */
router.get('/', function (request, response) {
    // 'find' returns all objects matching the given query - and all objects match the empty query "{}".

    // Most db operations take a function as their second argument, which is called after the query completes. This
    // function executes after the operation finishes - if there's an error, the first argument (err) is true. If not,
    // the second argument (rides) contains our results.
    User.find({}, function (err, users) {
        if (err) {
            return response.status(500); // db error (500 internal server error)
        }
        if (!users) {
            return response.status(404); // not found (404 not found)
        }
        response.status(200).send(users); // success - send the user!
    })
});


router.get('/:username', function (req, res) {
  User.findOne({ username: req.params.username }, (err, user) => {
    if (err) return res.status(500);
    if (!res || user === null) return res.status(404).send('404');
    return res.status(200).send(user);
  });
});

router.get('/checked/:username', (req, res) => {
  if (req.userData.user !== req.params.username) {
    return res.status(401).send();
  }

  User.findOne({ username: req.params.username }, (err, user) => {
    if (err) return res.status(500);
    if (!res || user === null) return res.status(404).send('404');
    return res.status(200).send(user);
  });

  return 0;
});

router.post('/', (req, res) => {
  User.findOne({ username: req.query.username }, (err, user) => {
    if (err) return res.status(500);
    if (!res) return res.status(404);
    if (user) return res.status(403).send('403');
    User.create({
      username: req.query.username,
      first_name: req.query.first_name || req.query.username,
      last_name: req.query.last_name || '',
      email: req.query.email || `${req.query.username}@rice.edu`,
      phone: req.query.phone || req.query.phone || '',
    }, (writeErr, writeUser) => {
      if (writeErr) return res.status(500);
      return res.status(200).send(writeUser);
    });
    return 0;
  });
});

router.delete('/:username', (req, res) => {
  User.findOne({ username: req.params.username }, (err, user) => {
    if (err) return res.status(500).send();
    if (!res) return res.status(404).send();

    User.remove({
      _id: user._id,
    }, () => {
      if (err) return res.status(500).send();
      return res.status(200).send(user);
    })
    return 0;
  })
})

router.put('/:username/edit', (req, res) => {
  User.findOne({ username: req.params.username }, (err, user) => {
    if (req.userData.user !== req.params.username) {
      return res.status(401).send();
    }

    if (err) return res.status(500).send();
    if (!user) return res.status(404).send();

    // Extend the user (copies values from req.body onto user) and save it if req is sent by a valid user.
    if (!(Object.keys(req.body).every(prop => User.schema.paths.hasOwnProperty(prop)))) {
      return res.status(400).send('Given object does not match db format');
    }
    user = _.extend(user, req.body);
    user.save((err, user) => {
      if (err) return res.status(500).send();
      return res.status(200).send(user);
    });
  });

  return 0;
});

module.exports = router;
