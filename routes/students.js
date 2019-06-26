const express = require('express');
const router = express.Router();

const studentController = require('../controller/students');

//------------STUDENT----------------------
router.get('/', studentController.getAll);
router.get('/JSON', studentController.getAll);
router.get('/:id', studentController.getOneStudent);
router.get('/JSON/:id', studentController.getOneStudent);
router.post('/', studentController.postStudent);
router.put('/:id', studentController.putStudent);
router.delete('/:id', studentController.deleteStudent);


module.exports = router;