const usersController = require('./controller')
const express = require('express');
const router = express.Router();

// router.post('/', usersController.createCategory);
router.get('/', usersController.getUsers);
// router.delete('/:slug', categoryController.deleteCategory);

module.exports = router;
