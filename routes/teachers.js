const express = require('express');
const router = express.Router();

const teacherController = require('../controller/teachers');

//------------TEACHER----------------------
router.get('/', teacherController.getAll);
router.get('/JSON', teacherController.getAll);
router.get('/:id', teacherController.getOneTeacher);
router.get('/JSON/:id', teacherController.getOneTeacher);
router.post('/', teacherController.postTeacher);
router.put('/:id', teacherController.putTeacher);
router.delete('/:id', teacherController.deleteTeacher);

module.exports = router;