const usersController = require('./controller')
const express = require('express');
const router = express.Router();

router.get('/', usersController.getUsers);
router.post('/', usersController.getUser);
router.post('/register', usersController.addUser);
router.post('/score', usersController.updateScore);

module.exports = router;
