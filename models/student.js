const mongoose = require("mongoose");
const studentSchema = require('../schema').studentSchema;
const Student = mongoose.model('Student', studentSchema, 'student');


exports.findAll = function (where, projection) {
  return Student.find(where,projection);
};

exports.insertOne = (student) =>{
  return Student.create(student);
};

exports.findOne = function (where, projection) {
  return Student.findOne(where, projection);
};

exports.update = (where, student) =>{
  return Student.findOneAndUpdate(where, { $set: { ...student } }, {  new:true });
};

exports.delete = (id) => {
  return Student.findOneAndUpdate(id, {$set: {status: 0}}).then(result=>{});
};

// exports.updateCourse = (id, set) => {
//   return Student.findOneAndUpdate({'course.id':id, 'status':1}, {$set: {"course.$": set}});
// };

exports.deleteCourse = (id) => {
  //console.log(id);
  return Student.findOneAndUpdate({'course.id':id, 'status':1}, {$set: {status:0}});
};

exports.updateMany = function(where, setDoc) {

  return Student.updateMany(where, { $set: setDoc });
};

exports.updateTeacher = (course, session) => {
  return Student.findOneAndUpdate({'status':1, 'course.id':course.id}, {$set: {'course.$':course}})/*.session(session)*/;
};










/*let students = [
  { 
    "id": 1,
    "name": "Marcos",
    "lastName": "Paulo",
    "age": 20,
    "course": { 
      "id": 1,
      "name": "Sistemas de Informação",
      "period": "Matutino",
      "city": "Ipatinga",
      "teachers": [
        { "id": 1, "name": "Teacher", "lastName": "01", "phd": false }
      ]
    }
  },
  { 
    "id": 2,
    "name": "Pedro",
    "lastName": "Henrique",
    "age": 21,
    "course": { 
      "id": 1,
      "name": "Sistemas de Informação",
      "period": "Matutino",
      "city": "Ipatinga",
      "teachers": [
        { "id": 1, "name": "Teacher", "lastName": "01", "phd": false }
      ]
    }
  },
  { 
    "id": 3,
    "name": "Lucas",
    "lastName": "Rodrigues",
    "age": 22,
    "course": { 
      "id": 1,
      "name": "Sistemas de Informação",
      "period": "Matutino",
      "city": "Ipatinga",
      "teachers": [
        { "id": 1, "name": "Teacher", "lastName": "01", "phd": false }
      ]
    } 
  }
];

var idCounter = students.length;

const getAll = function(callback) {
  callback(students);
}

const _getNextId = function() {
  return ++idCounter;
}

const add = function(student, callback) {
  student.id = _getNextId();

  students.push(student);

  callback();
}

const deleteAll = function(callback) {
  students = [];

  callback();
}

const deleteById = function(id, callback) {
  var student = students.find(s => s.id === id);
  var index = students.indexOf(student);

  if (index >= 0) {
    students.splice(index, 1);
    callback(null, null);
  } else {
    callback({ message: 'Student not Found' }, null);
  }

}

const findById = function(id, callback) {
  var student = students.find(s => s.id === id);

  callback(student);
}

const updateById = function(id, student, callback) {
  var student = students.find(s => s.id === id);
  var index = students.indexOf(student);

  if (index >= 0) {
    students[index] = student;
    callback(null, null);
  } else {
    callback({ message: 'Student not Found' }, null);
  }

}

module.exports = { getAll, add, deleteAll, deleteById, findById, updateById }; */
