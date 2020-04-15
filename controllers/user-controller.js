const moment = require('moment');
const User = require('../models/user');

exports.createUser = (req, res, next) => {
  const user = new User({
    username: req.body.newUser,
    log: [],
    count: 0
  });
  user.save().then(userData => {
    res.json({
      username: userData.username,
      _id: userData._id
    });
  }).catch(error => {
    res.json({ error });
  });
}

exports.fetchUsers = (req, res, next) => {
  User.find({}, '_id username').sort({
    username: 'asc'
  }).then(userData => {
    res.json({ userData });
  }).catch(error => {
    res.json({ error });
  });
}

exports.fetchUserLog = (req, res, next) => {
  const limit = parseInt(req.query.limit);
  let from = req.query.from;
  let to = req.query.to;
  let log;

  if ((moment(from, 'YYYY-MM-DD', true).isValid() && moment(to, 'YYYY-MM-DD', true).isValid()) || !from && !to) {
    User.findById(req.params.userid, '_id username log count').populate({
      path: 'log',
      select: 'description duration date -_id',
      options: {
        sort: { date: 'desc' }
      }
    }).then(userData => {
      log = userData.log;

      if (from && to) {
        log = log.filter(exercise => moment(exercise.date).isBetween(from, to, null, []));
      }

      if (limit) {
        log = log.slice(0, limit);
      }

      log = log.reduce((acc, exercise) => {
        acc.push({
          description: exercise.description,
          duration: exercise.duration,
          date: new Date(exercise.date).toISOString().split('T')[0]
        });
        return acc;
      }, []);

      res.json({
        _id: userData._id,
        username: userData.username,
        log,
        count: userData.count
      });
    }).catch(error => {
      res.json({ error });
    });
  }
  else {
    res.json({
      error: 'Invalid date range.'
    });
  }
}
