const express = require('express');
const router = express.Router();

const usersController = require('../controller/users');

//-------------USER------------------------
router.get('/', usersController.getAllUsers);
router.get('/JSON', usersController.getAllUsers);
router.get('/:id', usersController.getOneUser);
router.get('/JSON/:id', usersController.getOneUser);

router.post('/', usersController.postUser);
router.put('/:id', usersController.putUser);
router.delete('/:id', usersController.deleteUser);


module.exports = router;



