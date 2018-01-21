const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');

const User = require('../models/user');
const authMiddleWare = require('../middleware/auth-middleware');

router.use(bodyParser.json());

if (process.env.NODE_ENV !== 'test') {
  router.use(authMiddleWare);
}

router.get('/:username', (req, res) => {
  User.findOne({ username: req.params.username }, (err, user) => {
    if (err) return res.status(500);
    if (!res || user === null) return res.status(404).send('404');
    return res.status(200).send(user);
  });
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
    if (err) return res.status(500);
    if (!res) return res.status(404);

    User.remove({
      _id: user._id,
    }, () => {
      if (err) return res.status(500);
      return res.status(200).send(user);
    });
    return 0;
  });
});

module.exports = router;
