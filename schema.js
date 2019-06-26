//Schema and Business Rule for the Project

const mongoose = require("mongoose");
const schema = mongoose.Schema;

 userSchema = new schema(
    {
            id: {type: Number, require:true},
            name: {type: String, require:true},
            lastName: {type: String, require:true},
            profile: {type: String, require:true, enum:['guess', 'admin']},
            status: {type: Number, require:true}

    },{versionKey: false}
);

//var User = mongoose.model('User', userSchema);

 teacherSchema = new schema(
    {
            id: {type: Number, require:true},
            name: {type: String, require:true},
            lastName: {type: String, require:true},
            phd: {type: Boolean, require:true, validate: [val => {return val === true}, 'O professor deve obrigatoriamente possuir PHD']},
            status: {type: Number, require:true, default: 1}

    },{versionKey: false}
);

//var Teacher = mongoose.model('User', teacherSchema);

 courseSchema = new schema(
    {
            id: {type: Number, require:true},
            name: {type: String, require:true},
            period: {type: Number, require:true, default: 8},
            teacher: {type: [teacherSchema], validate: [val => {return val.length >= 2}, 'São necessários pelo menos 2 professores válidos']},
            city: {type: String, require:true},
            status: {type: Number, require:true, default: 1}

    },{versionKey: false}
);

//var Course = mongoose.model('Course', courseSchema);

 studentSchema = new schema(
    {
            id: {type: Number, require:true},
            name: {type: String, require:true},
            lastName: {type: String, require:true},
            age: {type: Number, require:true, min:[17, ' A idade minimia para o estudante é 17']},
            course:{type: courseSchema, require: true},
            status: {type: Number, require:true, default:1}

    },{versionKey: false}
);

//var Student = mongoose.model('Student', studentSchema);

module.exports = {userSchema, teacherSchema, courseSchema, studentSchema}

// module.exports = mongoose.model('User', userSchema);
// module.exports = mongoose.model('Teacher', teacherSchema);
// module.exports = mongoose.model('Course', courseSchema);
// module.exports = mongoose.model('Student', studentSchema);