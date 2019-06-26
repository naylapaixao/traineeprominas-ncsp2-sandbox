const express = require('express');
const router = express.Router();

// MONGODB CONNECTION
const mongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const password = 'wmX8iFwwVda7EHeU';
const mdbUrl = `mongodb+srv://dbAdmin:${password}@cluster0-5uemy.mongodb.net/test?retryWrites=true`;

let db;
let teacherCollection;
let counterCollection;
let courseCollection;
let studentCollection;

mongoClient.connect(mdbUrl, { native_parser: true }, (err, database) => {

  if (err) {
    console.error('Ocorreu um erro ao conectar ao mongoDB', err);
    // send.status(500);
  }
  else {
    console.log('Teacher CONECTOU!');

    db = database.db("trainee-prominas");
    teacherCollection = db.collection('teacher');
    counterCollection = db.collection('counter');
    courseCollection = db.collection('course');
    studentCollection = db.collection('student');
  }
});
// MONGODB CONNECTION

const teacherModel = require('../models/teacher');

router.get('/', function(req, res) {

  const projection = { _id: 0, id: 1, name: 1, lastName: 1, phd: 1 };

  teacherCollection.find({ status: 1 }, { projection })
    .toArray((err, users) => {
      if (err) {
        console.error("Erro ao conectar a collection 'teacher'", err);
        res.status(500).json("Erro ao conectar a collection 'teacher'");
      } else {
        res.json(users);
      }
    });
});

router.post('/', function(req, res) {
  
  // validation
  if (!req.body.hasOwnProperty('name') || !req.body.hasOwnProperty('lastName'))
    return res.status(401).json('Os campos name, lastName são obrigatórios.');

  // if valid creates the teacher object
  let teacher = {
    name: req.body.name,
    lastName: req.body.lastName,
    status: 1
  };

  // if phd is informed includes it in the teacher object
  if (req.body.hasOwnProperty('phd'))
    teacher.phd = req.body.phd === true ? true : false;

  (async () => {
    
    // sets teacher's unique id
    teacher.id = await _getNextIdValue();
  
    // persists the new teacher on database
    teacherCollection.insertOne(teacher, (err, result) => {

      if (err) {
        console.error("Erro ao Criar Um Novo Professor", err);
        res.status(500).json("Erro ao Criar Um Novo Professor");
      } else {
        res.status(201).json("Professor Cadastrado com Sucesso.");
      }
    });

  })();

});

router.delete('/:id', function(req, res) {
  
  let id = parseInt(req.params.id);

  // Don't actually remove just change user status
  teacherCollection.findOneAndUpdate({ id: id, status: 1 }, { $set: { status: 0 } }, (err, result) => {

    if (err) {
      console.error("Erro ao remover o Professor", err);
      res.status(500).json("Erro ao remover o Professor");
    } else {

      if (result.value) {

        (async () => {

          try {
            // Removes the teacher from all courses that he is associated
            await courseCollection.updateMany({ "status": 1, "teachers._id": result.value._id }, { $pull: { "teachers": { "_id": result.value._id} } });

            // Removes the teacher from all student.course that he is associated
            await studentCollection.updateMany({ "status": 1, "course.teachers._id": result.value._id }, { $pull: { "course.teachers": { "_id": result.value._id} } });

          } catch(err) {
            console.error(err);
          }

          console.log(`INF: Professor Removido`);
          res.status(200).json(`Professor Removido`);

        })();

      } else {
        console.log('Nenhum Professor Removido');
        res.status(204).json('Nenhum Professor Removido');
      }
    }

  });

});

router.get('/:id', function(req, res) {
  
  let id = parseInt(req.params.id);

  const projection = { _id: 0, id: 1, name: 1, lastName: 1, phd: 1 };

  teacherCollection.findOne({ id: id, status: 1 }, { projection }, (err, teacher) => {

    if (err) {
      console.error("Erro ao conectar a collection 'teacher'", err);
      res.status(500).json("Erro ao conectar a collection 'teacher'");
    } else {

      if (teacher)
        res.json(teacher);
      else
        res.status(404).json("Professor não Encontrado.");
    }
  });

});

router.put('/:id', function(req, res) {
  
  // validation
  if (!req.body.hasOwnProperty('name') || !req.body.hasOwnProperty('lastName'))
    return res.status(401).json('Os campos name, lastName são obrigatórios.');

  // if valid creates the teacher object
  let teacher = {
    name: req.body.name,
    lastName: req.body.lastName
  };

  // if phd is informed includes it in the teacher object
  if (req.body.hasOwnProperty('phd'))
    teacher.phd = req.body.phd === true ? true : false;

  // collects the teacher's id
  let id = parseInt(req.params.id);

  // updates the teacher if it exists and it is active
  teacherCollection.findOneAndUpdate({ id: id, status: 1 }, { $set: { ...teacher } }, { returnOriginal: false }, (err, result) => {

    if (err) {
      console.error("Erro ao conectar a collection 'teacher'", err);
      res.status(500).json("Erro ao conectar a collection 'teacher'");
    } else {

      if (result.value) {

        (async () => {

          let updatedTeacher = result.value;

          try {
            
            // Updates the teacher from all courses that he is associated
            await courseCollection.updateMany(
              { "status": 1, "teachers._id": updatedTeacher._id }, 
              { $set: { "teachers.$":  updatedTeacher } });

            // Updates the teacher from all student.course that he is associated
            await studentCollection.updateMany(
              { "status": 1, "course.teachers._id": updatedTeacher._id }, 
              { $set: { "course.teachers.$":  updatedTeacher } });

          } catch(err) {
            console.error(err);
          }

          console.log(`INF: Professor Atualizado`);
          res.status(200).json(`Professor Atualizado`);

        })();

      } else {
        console.log('Professor não Encontrado.');
        res.status(404).json('Professor não Encontrado.');
      }
    }

  });

});

const _getNextIdValue = () => {

  const sequenceName = "teacher_id";

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
