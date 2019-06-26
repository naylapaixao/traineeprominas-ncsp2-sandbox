const express = require('express');
const router = express.Router();

const courseController = require('../controller/courses');

//------------COURSE----------------------
router.get('/', courseController.getAll);
router.get('/JSON', courseController.getAll);
router.get('/:id', courseController.getOneCourse);
router.get('/JSON/:id', courseController.getOneCourse);
router.post('/', courseController.postCourse);
router.put('/:id', courseController.putCourse);
router.delete('/:id', courseController.deleteCourse)

module.exports = router;
