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

/**
 * Find a user by ID.
 */
router.get('/:user_id', (req, res) => {
  User.findById(req.params.user_id, (err, user) => {
    if (err) return res.status(500).send('Internal Error');
    if (!user) return res.status(404).send('Could not find user by ID.');
    console.log('Found user with profile:', user);
    return res.status(200).send(user);
  });
});

// router.get('/checked/:username', (req, res) => {
//   if (req.userData.user !== req.params.username) {
//     return res.status(401).send();
//   }
//
//   User.findOne({ username: req.params.username }, (err, user) => {
//     if (err) return res.status(500);
//     if (!res || user === null) return res.status(404).send('404');
//     return res.status(200).send(user);
//   });
//
//   return 0;
// });

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
      phone: req.query.phone || '',
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
    });
    return 0;
  });
});

/**
 * Edit a user's profile based on their ID.
 */
router.put('/:user_id/edit', (req, res) => {
  User.findById(req.params.user_id, (err, user) => {
    if (err) return res.status(500).send('Internal Error');
    if (!user) return res.status(404).send('Could not find user by ID.');

    // Extend the user (copies values from req.body onto user) and save it if req is sent by a valid user.
    if (!(Object.keys(req.body).every(prop => User.schema.paths.hasOwnProperty(prop)))) {
      return res.status(400).send('Given object does not match DB format.');
    }

    user = _.extend(user, req.body);
    console.log('Updating user with new profile:', user);
    user.save((saveErr, savedUser) => {
      if (err) return res.status(500).send('Internal Error');
      if (!savedUser) return res.status(404).send('Could not save new user profile.');
      return res.status(200).send(user);
    });
  });

  return 0;
});

module.exports = router;
