const express = require('express');
const router = express.Router();

// MONGODB CONNECTION
const mongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const password = 'wmX8iFwwVda7EHeU';
const mdbUrl = `mongodb+srv://dbAdmin:${password}@cluster0-5uemy.mongodb.net/test?retryWrites=true`;

let db;
let studentCollection;
let courseCollection;
let counterCollection;

mongoClient.connect(mdbUrl, { native_parser: true }, (err, database) => {

  if (err) {
    console.error('Ocorreu um erro ao conectar ao mongoDB', err);
    // send.status(500);
  }
  else {
    console.log('Students CONECTOU!');

    db = database.db("trainee-prominas");
    studentCollection = db.collection('student');
    courseCollection = db.collection('course');
    counterCollection = db.collection('counter');
  }
});
// MONGODB CONNECTION

const studentModel = require('../models/student');
const courseModel = require('../models/course');

router.get('/', function(req, res) {

  const projection = {
    "_id": 0,
    "status": 0,
    "course._id": 0,
    "course.status": 0,
    "course.teachers._id": 0,
    "course.teachers.status": 0
  };

  studentCollection.find({ status: 1 }, { projection })
    .toArray((err, students) => {
      if (err) {
        console.error("Erro ao conectar a collection 'student'", err);
        res.status(500).json("Erro ao conectar a collection 'student'");
      } else {
        res.json(students);
      }
    });
});

router.post('/', function(req, res) {
  
  // validation - Required Fields
  if (
      !req.body.hasOwnProperty('name') || 
      !req.body.hasOwnProperty('lastName') || 
      !req.body.hasOwnProperty('age') || 
      !req.body.hasOwnProperty('course'))
    return res.status(401).json('Os campos name, lastName, age e course são obrigatórios.');

  // if valid creates the student object
  let student = {
    name: req.body.name,
    lastName: req.body.lastName,
    age: req.body.age,
    status: 1
  };

  (async () => {

    // replace course id by the entire course object
    let course = await _getOneCourse(parseInt(req.body.course));

    // if course id is invalid abort the creation of the student
    if (!course)
      return res.status(401).json('O Curso Informado Não Existe.');

    // If course is valid continues
    student.course = course;

    // sets student's unique id
    student.id = await _getNextIdValue();

    // persists the new course on database
    studentCollection.insertOne(student, (err, result) => {

      if (err) {
        console.error("Erro ao Criar Um Novo Estudante", err);
        res.status(500).json("Erro ao Criar Um Novo Estudante");
      } else {
        res.status(201).json("Estudante Cadastrado com Sucesso.");
      }
    });

  })();

});

router.delete('/:id', function(req, res) {
  
  let id = parseInt(req.params.id);

  // Don't actually remove just change user status
  studentCollection.findOneAndUpdate({ id: id, status: 1 }, { $set: { status: 0 } }, (err, result) => {

    if (err) {
      console.error("Erro ao remover o Estudante", err);
      res.status(500).json("Erro ao remover o Estudante");
    } else {

      if (result.value) {
        console.log(`INF: Estudante Removido`);
        res.status(200).json(`Estudante Removido`);
      } else {
        console.log('Nenhum Estudante Removido');
        res.status(204).json('Nenhum Estudante Removido');
      }
    }

  });

});

router.get('/:id', function(req, res) {
  
  let id = parseInt(req.params.id);

  const projection = {
    "_id": 0,
    "status": 0,
    "course._id": 0,
    "course.status": 0,
    "course.teachers._id": 0,
    "course.teachers.status": 0
  };

  studentCollection.findOne({ id: id, status: 1 }, { projection }, (err, student) => {

    if (err) {
      console.error("Erro ao conectar a collection 'student'", err);
      res.status(500).json("Erro ao conectar a collection 'student'");
    } else {

      if (student)
        res.json(student);
      else
        res.status(404).json("Estudante não Encontrado.");
    }
  });

});

router.put('/:id', function(req, res) {

  // validation - Required Fields
  if (
      !req.body.hasOwnProperty('name') || 
      !req.body.hasOwnProperty('lastName') || 
      !req.body.hasOwnProperty('age') || 
      !req.body.hasOwnProperty('course'))
    return res.status(401).json('Os campos name, lastName, age e course são obrigatórios.');

  // if valid creates the student object
  let student = {
    name: req.body.name,
    lastName: req.body.lastName,
    age: req.body.age,
  };

  // collects the student's id
  let id = parseInt(req.params.id);

  (async () => {

    // replace course id by the entire course object
    let course = await _getOneCourse(parseInt(req.body.course));

    // if course id is invalid abort the creation of the student
    if (!course)
      return res.status(401).json('O Curso Informado Não Existe.');

    // If course is valid continues
    student.course = course;

    // persists the new course on database
    studentCollection.findOneAndUpdate({ id: id, status: 1 }, { $set: { ...student } }, (err, result) => {

      if (err) {
        console.error("Erro ao conectar a collection 'student'", err);
        res.status(500).json("Erro ao conectar a collection 'student'");
      } else {

        if (result.value) {
          console.log(`INF: Estudante Atualizado`);
          res.status(200).json(`Estudante Atualizado`);
        } else {
          console.log('Estudante não Encontrado.');
          res.status(404).json('Estudante não Encontrado.');
        }
      }

    });

  })();

});

const _getOneCourse = (id) => {

  return new Promise((resolve, reject) => {

    courseCollection.findOne({ id: id, status: 1 }, (err, course) => {
      err ? reject(err) : resolve(course);
    });

  });
};

const _getNextIdValue = () => {

  const sequenceName = "student_id";

  return new Promise((resolve, reject) => {

    counterCollection.findOneAndUpdate(
      { _id: sequenceName },
      { $inc: { "sequence_value": 1 } },
      { returnOriginal: false },
      (err, result) => {
        err ? reject(err) : resolve(result.value.sequence_value);
    });

  });

}

module.exports = router;
