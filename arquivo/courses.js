const express = require('express');
const router = express.Router();

// MONGODB CONNECTION
const mongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const password = 'wmX8iFwwVda7EHeU';
const mdbUrl = `mongodb+srv://dbAdmin:${password}@cluster0-5uemy.mongodb.net/test?retryWrites=true`;

let db;
let courseCollection;
let teacherCollection;
let counterCollection;
let studentCollection;

mongoClient.connect(mdbUrl, { native_parser: true }, (err, database) => {

  if (err) {
    console.error('Ocorreu um erro ao conectar ao mongoDB', err);
    // send.status(500);
  }
  else {
    console.error('Course CONECTOU!');

    db = database.db("trainee-prominas");
    courseCollection = db.collection('course');
    teacherCollection = db.collection('teacher');
    counterCollection = db.collection('counter');
    studentCollection = db.collection('student');
  }
});
// MONGODB CONNECTION

router.get('/', function(req, res) {
  
  const projection = { "_id": 0, "status": 0, "teachers._id": 0, "teachers.status": 0 };

  courseCollection.find({ status: 1 }, { projection })
    .toArray((err, courses) => {
      if (err) {
        console.error("Erro ao conectar a collection 'courses'", err);
        res.status(500).json("Erro ao conectar a collection 'courses'");
      } else {
        res.json(courses);
      }
    });
});

router.post('/', function(req, res) {
  
  // validation - Required Fields
  if (!req.body.hasOwnProperty('name') ||  !req.body.hasOwnProperty('city'))
    return res.status(401).json('Os campos name, city e teachers são obrigatórios.');

  // if valid creates the course object
  let course = {
    name: req.body.name,
    period: req.body.period || 8,
    city: req.body.city,
    status: 1
  };

  (async () => {
    
    // sets course's unique id
    course.id = await _getNextIdValue();

    let validTeachers = [];
    let invalidTeachers = [];

    // If some teacher id is informed replace teachers ids by the entire teacher object
    if (req.body.hasOwnProperty('teachers') && Array.isArray(req.body.teachers) && req.body.teachers.length > 0) {

      for (let i = 0; i < req.body.teachers.length; i++) {
        let teacher = await _getOneTeacher(parseInt(req.body.teachers[i]));

        if (teacher)
          validTeachers.push(teacher);
        else
          invalidTeachers.push(req.body.teachers[i]);
      }

      course.teachers = validTeachers;
    }
  
    // persists the new course on database
    courseCollection.insertOne(course, (err, result) => {

      if (err) {
        console.error("Erro ao Criar Um Novo Curso", err);
        res.status(500).json("Erro ao Criar Um Novo Curso");
      } else {

        // If some invalid teacher id was informed
        if (invalidTeachers.length > 0)
          return res.status(201).json(`Curso Cadastrado com Sucesso. Os seguintes ids de professores não foram encontrados: ${invalidTeachers}`);

        res.status(201).json("Curso Cadastrado com Sucesso.");
      }
    });

  })();

});

router.delete('/:id', function(req, res) {
  
  let id = parseInt(req.params.id);

  (async () => {

    let numRegisteredStudents = await studentCollection.countDocuments({ "status": 1, "course.id": id });

    // Don't "remove" a course if there are registered students on it
    if (numRegisteredStudents > 0)
      return res.status(401).json('O Curso Informado Não Pôde ser Removido Porque Possui Estudantes Matriculados.');

    // Don't actually remove just change user status
    courseCollection.findOneAndUpdate({ id: id, status: 1 }, { $set: { status: 0 } }, (err, result) => {

      if (err) {
        console.error("Erro ao remover o Curso", err);
        res.status(500).json("Erro ao remover o Curso");
      } else {

        if (result.value) {
          console.log(`INF: Curso Removido`);
          res.status(200).json(`Curso Removido`);
        } else {
          console.log('Nenhum Curso Removido');
          res.status(204).json('Nenhum Curso Removido');
        }
      }

    });

  })();

});

router.get('/:id', function(req, res) {
  
  let id = parseInt(req.params.id);

  const projection = { "_id": 0, "status": 0, "teachers._id": 0, "teachers.status": 0 };

  courseCollection.findOne({ id: id, status: 1 }, { projection }, (err, course) => {

    if (err) {
      console.error("Erro ao conectar a collection 'course'", err);
      res.status(500).json("Erro ao conectar a collection 'course'");
    } else {

      if (course)
        res.json(course);
      else
        res.status(404).json("Curso não Encontrado.");
    }
  });

});

router.put('/:id', function(req, res) {
  
  // validation - Required Fields
  if (!req.body.hasOwnProperty('name') ||  !req.body.hasOwnProperty('city'))
    return res.status(401).json('Os campos name, city e teachers são obrigatórios.');

  // if valid creates the course object
  let course = {
    name: req.body.name,
    period: req.body.period || 8,
    city: req.body.city,
    status: 1
  };

  // collects the course's id
  let id = parseInt(req.params.id);

  (async () => {

    // replace teachers ids by the entire teacher object
    let validTeachers = [];
    let invalidTeachers = [];

    // If some teacher id is informed replace teachers ids by the entire teacher object
    if (req.body.hasOwnProperty('teachers') && Array.isArray(req.body.teachers) && req.body.teachers.length > 0) {
      
      for (let i = 0; i < req.body.teachers.length; i++) {
        let teacher = await _getOneTeacher(parseInt(req.body.teachers[i]));

        if (teacher)
          validTeachers.push(teacher);
        else
          invalidTeachers.push(req.body.teachers[i]);
      }

      course.teachers = validTeachers;
    }
  
    // updates the course if it exists and it is active
    courseCollection.findOneAndUpdate({ id: id, status: 1 }, { $set: { ...course } }, { returnOriginal: false }, (err, result) => {

      if (err) {
        console.error("Erro ao conectar a collection 'course'", err);
        res.status(500).json("Erro ao conectar a collection 'course'");
      } else {

        if (result.value) {

          // updates all users that have this course with the updated data about it
          studentCollection.updateMany({ "status": 1, "course._id": result.value._id }, { $set: { course: { ...result.value } } }, (err, result) => {

            if (err) console.error(err);

            // If some invalid teacher id was informed
            if (invalidTeachers.length > 0)
              return res.status(201).json(`Curso Atualizado com Sucesso. Os seguintes ids de professores não foram encontrados: ${invalidTeachers}`);

            console.log(`INF: Curso Atualizado`);
            res.status(200).json(`Curso Atualizado`);
          
          });

          
        } else {
          console.log('Curso não Encontrado.');
          res.status(404).json('Curso não Encontrado.');
        }
      }

    });

  })();


});

const _getOneTeacher = (id) => {

  return new Promise((resolve, reject) => {

    teacherCollection.findOne({ id : id, status: 1 }, (err, teacher) => {
      err ? reject(err) : resolve(teacher);
    });

  });
};

const _getNextIdValue = () => {

  const sequenceName = "course_id";

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
