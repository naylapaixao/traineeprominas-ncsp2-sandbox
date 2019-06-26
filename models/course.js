const mongoose = require("mongoose");
const courseSchema = require('../schema').courseSchema;
const Course = mongoose.model('Course', courseSchema, 'course');



exports.findAll = function (where, projection) {
  return Course.find(where, projection);
};

exports.insertOne = (course) =>{
  return Course.create(course);
};

exports.findOne = function(where, projection) {
  return Course.findOne(where, projection);
};

/*exports.update = (course, where) => {
  return courseCollection.findOneAndUpdate(where, { $set: { ...course } }, { returnOriginal: false });
} */

// exports.update = (course, set) => {
//   return courseCollection.findOneAndUpdate(course, {$set: set});
// };

exports.update = (query, set) => {
  //return courseCollection.findOneAndUpdate(query, {$set: {...set}}, { returnOriginal: false });
  return Course.findOneAndUpdate(query, set, { new:true });
};

exports.delete = (id) => {
  return Course.findOneAndUpdate(id, {$set: {status: 0}});
};

exports.getCourse = (id) => {
  return Course.find({'id':id, 'status':1});
};

exports.updateMany = async function(where, setDoc) {

  // console.log('>>>>>>>>>>>>>>>>>', where, await Course.find({ "status": 1, "teacher": { $elemMatch: { "id": 8 } } }).exec());
  // console.log('>>>>>>>>>>>>>>>>>', where, await Course.find(where).exec());

  return Course.updateMany(where, { $set: setDoc });
};

exports.deleteProf = (id) => {
  return Course.findOneAndUpdate({'status':1, 'teacher.id':id}, {$pull: {"teacher": {'id': id}}});
};

exports.getAllTeachers =  () => {
  return Course.find({"status": 1});
};

exports.get_loopUp = (where, projection) =>  {
  return Course.aggregate([{$match: where}, {$lookup: {from: 'teacher', localField: 'teacher.id', foreignField: "id", as: "Professors"}}]);
};




















/*let courses = [
  { 
    "id": 1,
    "name": "Sistemas de Informação",
    "period": "Matutino",
    "city": "Ipatinga",
    "teachers": [
      { "id": 1, "name": "Teacher", "lastName": "01", "phd": false }
    ]
  },
  { 
    "id": 2,
    "name": "Ciências da Computação",
    "period": "Vespertino",
    "city": "Coronel Fabriciano",
    "teachers": [
      { "id": 2, "name": "Teacher", "lastName": "02", "phd": true }
    ]
  },
  { 
    "id": 3,
    "name": "Engenharia da Computação",
    "period": "Noturno",
    "city": "Timotéo",
    "teachers": [
      { "id": 3, "name": "Teacher", "lastName": "03", "phd": true }
    ]
  }
];

var idCounter = courses.length;

const getAll = function(callback) {
  callback(courses);
}

const _getNextId = function() {
  return ++idCounter;
}

const add = function(course, callback) {
  course.id = _getNextId();

  courses.push(course);

  callback();
}

const deleteAll = function(callback) {
  courses = [];

  callback();
}

const deleteById = function(id, callback) {
  var course = courses.find(c => c.id === id);
  var index = courses.indexOf(course);

  if (index >= 0) {
    courses.splice(index, 1);
    callback(null, null);
  } else {
    callback({ message: 'Course not Found' }, null);
  }

}

const findById = function(id, callback) {
  var course = courses.find(c => c.id === id);

  callback(course);
}

const findByIdSync = function(id) {
  var course = courses.find(c => c.id === id);

  return course;
}

const updateById = function(id, course, callback) {
  var course = courses.find(c => c.id === id);
  var index = courses.indexOf(course);

  if (index >= 0) {
    courses[index] = course;
    callback(null, null);
  } else {
    callback({ message: 'Course not Found' }, null);
  }

}

module.exports = { getAll, add, deleteAll, deleteById, findById, findByIdSync, updateById }; */