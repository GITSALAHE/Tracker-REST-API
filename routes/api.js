const express = require('express');
const userController = require('../controllers/user-controller');
const exerciseController = require('../controllers/exercise-controller');
const router = express.Router();

router.post('/new-user', userController.createUser);

router.post('/add', exerciseController.addExercise);

router.get('/users', userController.fetchUsers);

router.get('/log/:userid', userController.fetchUserLog);

module.exports = router;
