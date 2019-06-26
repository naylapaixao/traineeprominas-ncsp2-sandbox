const mongoose = require("mongoose");
const teacherSchema = require('../schema').teacherSchema;
const Teacher = mongoose.model('Teacher', teacherSchema, 'teacher');



exports.findAll = function (where, projection) {
  return Teacher.find(where,projection);
};

exports.findOne = async function (query, projection) {
  return Teacher.findOne(query, projection);
};

exports.insertOne = (teacher) =>{
  return Teacher.create(teacher);

  /*if (teacher.phd == true) {
    teacher.id = ++id;
    return teacherCollection.insertOne(teacher);
  }
  else {
    return new Promise((resolve, reject) => {
      resolve(false);
    });
  } */

}

exports.update = (where, teacher) =>{
  //return teacherCollection.findOneAndUpdate(where, { $set: { ...teacher } }, { returnOriginal: false });
  return Teacher.findOneAndUpdate(where, teacher, { new:true });
};

exports.delete = (id) => {

  return Teacher.findOneAndUpdate(id, {$set: {status: 0}});
};

exports.getTeacher = (id) => {
  return Teacher.find({'id':id, 'status':1}).toArray();
};


















/*let teachers = [
  { "id": 1, "name": "Teacher", "lastName": "01", "phd": false },
  { "id": 2, "name": "Teacher", "lastName": "02", "phd": true },
  { "id": 3, "name": "Teacher", "lastName": "03", "phd": true }
];

var idCounter = teachers.length;

const getAll = function(callback) {
  callback(teachers);
}

const _getNextId = function() {
  return ++idCounter;
}

const add = function(teacher, callback) {
  teacher.id = _getNextId();

  teachers.push(teacher);

  callback();
}

const deleteAll = function(callback) {
  teachers = [];

  callback();
}

const deleteById = function(id, callback) {
  var teacher = teachers.find(t => t.id === id);
  var index = teachers.indexOf(teacher);

  if (index >= 0) {
    teachers.splice(index, 1);
    callback(null, null);
  } else {
    callback({ message: 'Teacher not Found' }, null);
  }

}

const findById = function(id, callback) {
  var teacher = teachers.find(t => t.id === id);

  callback(teacher);
}

const findByIdSync = function(id) {
  var teacher = teachers.find(t => t.id === id);

  return teacher;
}

const updateById = function(id, teacher, callback) {
  var teacher = teachers.find(t => t.id === id);
  var index = teachers.indexOf(teacher);

  if (index >= 0) {
    teachers[index] = teacher;
    callback(null, null);
  } else {
    callback({ message: 'Teacher not Found' }, null);
  }

}

module.exports = { getAll, add, deleteAll, deleteById, findById, findByIdSync, updateById }; */
