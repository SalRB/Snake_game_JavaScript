const usersController = require('./controller')
const express = require('express');
const router = express.Router();

// router.post('/', usersController.createCategory);
router.get('/', usersController.getUsers);
router.post('/', usersController.getUser);
// router.delete('/:slug', categoryController.deleteCategory);

module.exports = router;
