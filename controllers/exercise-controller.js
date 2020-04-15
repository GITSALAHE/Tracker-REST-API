const moment = require('moment');
const User = require('../models/user');
const Exercise = require('../models/exercise');

exports.addExercise = (req, res, next) => {
  let exercise;

  if (moment(req.body.date, 'YYYY-MM-DD', true).isValid() || req.body.date === '') {
    exercise = new Exercise({
      userId: req.body.userId,
      description: req.body.description,
      duration: req.body.duration,
      date: req.body.date || moment().format('YYYY-MM-DD')
    });
    exercise.save().then(exerciseData => {
      User.findByIdAndUpdate(req.body.userId, {$push: {log: exerciseData}, $inc: {count: 1}}).then(userData => {
        res.json({
          _id: userData._id,
          username: userData.username,
          exercise: {
            description: exerciseData.description,
            duration: exerciseData.duration,
            date: exerciseData.date
          }
        });
      }).catch(error => {
        res.json({ error });
      });
    }).catch(error => {
      res.json({ error });
    });
  }
  else {
    res.json({
      error: 'Invalid date. Please use YYYY-MM-DD format.'
    });
  }
};
