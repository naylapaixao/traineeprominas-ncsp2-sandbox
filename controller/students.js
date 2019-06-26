const studentModel = require('../models/student');
const courseModel = require('../models/course');

//------MONGOOSE SCHEMA------
const mongoose = require("mongoose");
const studentSchema = require('../schema').studentSchema;
const Student = mongoose.model('Student', studentSchema);
//------MONGOOSE SCHEMA------

//------JOI VALIDATION --validades all the requiments are corrects
const Joi = require('joi');

const schemaStudent = Joi.object().keys({
    name: Joi.string().required(),
    lastName: Joi.string().required(),
    age: Joi.number().required(),
    course: Joi.required(),
});
//------JOI VALIDATION-----

var id;
Student.countDocuments({}, (err, count) => {
    id = count;
});

//------METHOD GET FOR ALL STUDENTS-----
exports.getAll = (req, res) => {
    let where = {'status':1};
    let projection = { _id: 0, id: 1, name: 1, lastName: 1, age: 1, course:1 };
    studentModel.findAll(where,projection)
        .then(students => {
            res.json(students);
        }).catch(err => {
        console.log(err);
        console.error("Ocorreu um erro ao enviar os usuários");
        res.status(500).json('Ocorreu um erro');
    });
};
//------METHOD GET FOR ALL STUDENTS-----

//------METHOD GET FOR ONE STUDENT-----
exports.getOneStudent = function (req, res) {
    let where = { id: parseInt(req.params.id), status: 1 };
    let projection = { _id: 0, id: 1, name: 1, lastName: 1, age: 1, course:1 };

    studentModel.findOne(where, projection)
        .then(student => {
            if (student) {
                return res.json(student);
            }else {
                return res.status(404).json("Estudante não Encontrado.");
            }
        })
        .catch(err =>{
            console.error("Erro ao conectar a collection student");
            res.status(500).json("Erro ao conectar a collection student");
        });
};
//------METHOD GET FOR ONE STUDENT-----

//------METHOD POST FOR STUDENT-----CREATES NEW STUDENT
exports.postStudent =  (req,res) => {
    //let student = new Student ({id: ++id, name: req.body.name, lastName: req.body.lastName, status: 1, age:req.body.age, course: req.body.course});

    //Start Validade the Values
    Joi.validate(req.body, schemaStudent, (err, result) => {
        if(!err) {
            (async function () {
                //let courseId = await getCourse(parseInt(req.body.course));

                //Check if course exist and return a value and in case false return invalid course
                // for (let i = 0; i < req.body.course.length; i++) {
                //     //let course = await getCourse(newstudent.course[i]);
                //     let course = await courseModel.getCourse(req.body.course[i]);
                //     //newstudent.course[i] = course;
                //
                //     if (course === false) {
                //         return res.status(401).json("Curso Inválido!");
                //     } else {
                //         req.body.course[i] = course[0];
                //     }
                // }

                let course = await courseModel.getCourse(req.body.course);

                if (course === false || course.length === 0) {
                    return res.status(401).json("Curso Inválido!");
                } else {
                    req.body.course = course[0];
                }

                //Checks students information and creates new student in model
                let student = new Student({
                    id: ++id,
                    name: req.body.name,
                    lastName: req.body.lastName,
                    status: 1,
                    age: req.body.age,
                    course: req.body.course
                });

                //console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', student);

                //Validades student if corrects create a new one in model
                student.validate(error => {
                    //console.log(error);
                    if (!error) {
                        return studentModel.insertOne(student)
                            .then(result => {
                                // if(result != false){
                                res.status(201).json('Estudante cadastrado com sucesso!');
                                // }else{
                                //     res.status(401).json('Não foi possível cadastrar o estudante curso ou idade invalido');
                                // }
                            })

                            .catch(err => {
                                console.error("Erro ao conectar a collection student: ", err);
                                res.status(500);
                            });
                    } else {
                        res.status(401).json('Não foi possível cadastrar o Estudante (idade deverá ser superior a 17)');
                    }
                });

            })();

        }else {
            res.status(401).json('Campos obrigatórios não preenchidos ou preenchidos de forma incorreta');
        }
    });

    /*if (req.body.name && req.body.lastName && req.body.course && (req.body.age >= 17)){
        let newstudent = req.body;
        newstudent.id = 0;
        newstudent.status = 1;

        // if (req.body.age < 17)
        //     return res.status(401).json("A idade mínima para cadastro de aluno é 17");

        (async function () {
            //let courseId = await getCourse(parseInt(req.body.course));

            for (let i = 0; i < newstudent.course.length; i++) {
                //let course = await getCourse(newstudent.course[i]);
                let course = await courseModel.getCourse(newstudent.course[i]);
                //newstudent.course[i] = course;

                if(course == false){
                    return res.status(401).json("Curso Inválido!");
                }else{
                    newstudent.course[i] = course[0];
                }
            }

            if (newstudent.course.length > 0){
                studentModel.insertOne(newstudent)
                    .then(user => {
                        res.status(201).json("Estudante Cadastrado com Sucesso.");
                    })
                    .catch(err => {
                        console.error("Erro ao Criar Um Novo Estudante", err);
                        res.status(500).json("Erro ao Criar Um Novo Estudante");
                    });
            }

        })();

    }else {
        res.status(401).json("Insira todos os campos obrigatorios e maioridade a partir de 17 anos");
    } */
};
//------METHOD POST FOR STUDENT-----CREATES NEW STUDENT

//------METHOD PUT FOR STUDENT-----UPDATES NEW STUDENT
exports.putStudent = (req, res) => {
    let student = ({id: parseInt(req.params.id), name: req.body.name, lastName: req.body.lastName, status: 1, age:req.body.age, course: req.body.course});
    let where = { id: parseInt(req.params.id), status: 1 };

    //Start Validade the Values
    Joi.validate(req.body, schemaStudent, (err, result) => {
        if(!err) {
            (async function () {
                //let courseId = await getCourse(parseInt(req.body.course));

                // //Check if course exist and return a value and in case false return invalid course
                // for (let i = 0; i < req.body.course.length; i++) {
                //     //let course = await getCourse(newstudent.course[i]);
                //     let course = await courseModel.getCourse(req.body.course[i]);
                //     //newstudent.course[i] = course;
                //
                //     if (course == false) {
                //         return res.status(401).json("Curso Inválido!");
                //     } else {
                //         req.body.course[i] = course[0];
                //     }
                // }

                let course = await courseModel.getCourse(req.body.course);

                // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', course);

                if (course === false || course.length === 0) {
                    return res.status(401).json("Curso Inválido!");
                } else {
                    student.course = course[0];
                }

                //Checks students information and updates the model
                let alterStudent = new Student(student);
                alterStudent.validate(error => {
                    //console.log(student);
                    if (!error) {
                        return studentModel.update(where, student)
                            .then(result => {
                                // if(result != false){
                                res.status(201).json('Estudante editado com sucesso!');
                                // }else{
                                //     res.status(401).json('Não foi possível editar o estudante curso ou idade invalido');
                                // }
                            })

                            .catch(err => {
                                console.error("Erro ao conectar a collection student: ", err);
                                res.status(500);
                            });
                    } else {
                        res.status(401).json('Não foi possível editar o Estudante (idade deverá ser superior a 17)');
                    }
                });

            })();
        }else {
            res.status(401).json('Campos obrigatórios não preenchidos ou preenchidos de forma incorreta');
        }
        /*if (req.body.name && req.body.lastName && req.body.course && (req.body.age >= 17)) {
            let id = parseInt(req.params.id);
            let alterStudent = req.body;
            alterStudent.id = parseInt(req.params.id);
            alterStudent.name = req.body.name;
            alterStudent.lastName = req.body.lastName;
            alterStudent.age = req.body.age;
            alterStudent.course = req.body.course;
            alterStudent.status = 1;

            (async function () {
                //let courseId = await getCourse(parseInt(req.body.course));

                for (let i = 0; i < alterStudent.course.length; i++) {
                    //let course = await getCourse(newstudent.course[i]);
                    let course = await courseModel.getCourse(alterStudent.course[i]);
                    //newstudent.course[i] = course;

                    if(course == false){  //!course
                        return res.status(401).json("Curso Inválido!");
                    }else{
                        alterStudent.course[i] = course[0];
                    }
                }

                if (alterStudent.course.length > 0) {
                    studentModel.update(alterStudent, { id: id, status: 1 })
                        .then(result => {

                            if (result.value) {
                                console.log(`INF: Estudante Atualizado`);
                                res.status(201).json(`Estudante Atualizado`);
                            } else {
                                console.log('Estudante não Encontrado.');
                                res.status(404).json('Estudante não Encontrado.');
                            }
                        })
                        .catch(err => {
                            console.error("Erro ao conectar a collection 'student'", err);
                            res.status(500).json("Erro ao conectar a collection 'student'");
                        });
                }

            })();
        }
        else {
            res.status(401).json("Insira todos os campos obrigatorios e maioridade a partir de 17 anos");
        } */

    });
};
//------METHOD PUT FOR STUDENT-----UPDATES NEW STUDENT

//------METHOD DELETE FOR STUDENT-----CHANGE THE STATUS 1 TO 0
exports.deleteStudent = (req, res) => {

    let where = {'id': parseInt(req.params.id), 'status':1};
    let set = {$set: {status:0}};

    // Don't actually remove just change user status
    studentModel.delete(where, set)
        .then(result => {

            if (result) {
                //console.log(`INF: Estudante Removido`);
                res.status(200).json(`Estudante Removido`);
            } else {
                //console.log('Nenhum Estudante Removido');
                res.status(204).json('Nenhum Estudante Removido');
            }
        })
        .catch(err => {
            console.error("Erro ao remover o Estudante", err);
            res.status(500).json("Erro ao remover o Estudante");
        });
};
//------METHOD DELETE FOR STUDENT-----CHANGE THE STATUS 1 TO 0