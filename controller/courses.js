const courseModel = require('../models/course');
const studentModel = require('../models/student');
const teacherModel = require('../models/teacher');

//------MONGOOSE SCHEMA------
const mongoose = require("mongoose");
const courseSchema = require('../schema').courseSchema;
const Course = mongoose.model('Course', courseSchema);
//------MONGOOSE SCHEMA------

//------JOI VALIDATION --validades all the requiments are corrects
const Joi = require('joi');

const schemaCourse = Joi.object().keys({
    name: Joi.string().required(),
    period: Joi.number(),
    city: Joi.string().required(),
    teacher: Joi.array().required(),
});
//------JOI VALIDATION-----

var id;
Course.countDocuments({}, (err, count) => {
    id = count;
});

//------METHOD GET FOR ALL COURSES-----
exports.getAll = (req, res) => {
    //Get only courses where status is 1
    let where = {'status':1};
    let projection = {_id:0, id:1, name:1, period:1, city:1, 'teacher.id':1, 'teacher.name':1, 'teacher.lastName':1, 'teacher.phd':1}//1 to show the information 0 to hide
    courseModel.findAll(where,projection)
    courseModel.get_loopUp(where,projection)
        .then(courses => {
            res.json(courses);
        }).catch(err => {
        console.log(err);
        console.error("Ocorreu um erro ao enviar os cursos");
        res.status(500).json('Ocorreu um erro');
    });
};
//------METHOD GET FOR ALL COURSES-----

//------METHOD GET FOR ONE COURSE-----
exports.getOneCourse = function (req, res) {

    let where = { id: parseInt(req.params.id), status: 1 };
    let projection = { _id: 0, id: 1, name: 1, period: 1, teacher: 1, city:1 };

    courseModel.findOne(where, projection)
        .then(course => {
            if (course) {
                return res.json(course);
            }else {
                return res.status(404).json("Curso não Encontrado.");
            }
        })
        .catch(err =>{
            console.error("Erro ao conectar a collection course");
            res.status(500).json("Erro ao conectar a collection course");
        });
};
//------METHOD GET FOR ONE COURSE-----

//------METHOD POST FOR COURSE-----CREATES NEW COURSE
exports.postCourse = (req, res) => {
    //Variable that will receive all the information about the course and validade on schema
    let course = new Course({id: ++id, name: req.body.name, period: req.body.period || 8, status: 1, teacher:req.body.teacher, city: req.body.city});

    //Start Validade the Values
    Joi.validate(req.body, schemaCourse, (err, result) => {
        if(!err) {

            (async function () {

                let validos = [];
                let invalidos = [];

                //IF INFORM TEACHER, GET TEACHER ID
                if (req.body.teacher) {
                    for (let i = 0; i < req.body.teacher.length; i++) {
                        //let teacher = await teacherModel.getTeacher(newcourse.teacher);
                        let teacherId = parseInt(req.body.teacher[i]);
                        let teacher = await teacherModel.findOne({id: teacherId});

                        //Checks if Id Teacher is valid or not
                        if (teacher ) {
                            validos.push(teacher);
                        } else {
                            invalidos.push(req.body.teacher[i]); //retorna id de professor inválido
                        }
                    }
                    course.teacher = validos; //retorna corpo de professores validos
                }

                //Validades all the requiments of course
                course.validate(error => {
                    if (!error) {
                        return courseModel.insertOne(course)
                            .then(result => {
                                res.status(201).json('Curso cadastrado com sucesso!');
                            })
                            .catch(err => {
                                console.error("Erro ao conectar a collection course: ", err);
                                res.status(500);
                            });
                    } else {
                        res.status(401).json('Não foi possível cadastrar o Curso');
                    }
                });

            })();

        } else{
            res.status(401).json('Campos obrigatórios não preenchidos ou preenchidos de forma incorreta');
        }

    });
    /* if (req.body.name && req.body.city){
        let newcourse = req.body;
        newcourse.period = parseInt(req.body.period) || 8;
        newcourse.status = 1;
        newcourse.id = 0;

        (async function() {

            let validos = [];
            let invalidos = [];

            //IF INFORM TEACHER, GET TEACHER ID
            if(req.body.teacher){
                for (let i = 0; i <req.body.teacher.length; i++) {
                    //let teacher = await teacherModel.getTeacher(newcourse.teacher);
                    let teacherId = parseInt(req.body.teacher[i]);
                    let teacher = await teacherModel.findOne({ id: teacherId });

                    if (teacher) {
                        validos.push(teacher);
                    }
                    else {
                        invalidos.push(req.body.teacher[i]); //retorna id de professor inválido
                    }
                }
                newcourse.teacher = validos; //retorna corpo de professores validos
            }

            if (newcourse.teacher.length < 2){
                return res.status(401).json('O curso deverá ter ao menos dois professores válidos.');

            }
            courseModel.insertOne(newcourse)
                .then(result => {

                    // If some invalid teacher id was informed
                    if (invalidos.length > 0)
                        return res.status(201).json(`Curso Cadastrado com Sucesso. Os seguintes ids de professores não foram encontrados: ${invalidos}`);

                    return res.status(201).json("Curso Cadastrado com Sucesso.");
                })
                .catch(err => {
                    console.error("Erro ao Criar Um Novo Curso", err);
                    res.status(500).json("Erro ao Criar Um Novo Curso");
                });

        })();
    } */
};
//------METHOD POST FOR COURSE-----CREATES NEW COURSE

//------METHOD PUT FOR COURSE-----UPDATES NEW COURSE
exports.putCourse = (req, res) =>{
    let course = ({id: parseInt(req.params.id), name: req.body.name, period: req.body.period || 8, status: 1, teacher:req.body.teacher, city: req.body.city});
    let where = { id: parseInt(req.params.id), status: 1 };
    //let alterCourse = new Course(course);

    //Start Validade the Values
    Joi.validate(req.body, schemaCourse, (err, result) => {
        if(!err) {
            (async function () {

                let validos = [];
                let invalidos = [];

                //IF INFORM TEACHER, GET TEACHER ID
                if (req.body.teacher) {
                    for (let i = 0; i < req.body.teacher.length; i++) {
                        //let teacher = await teacherModel.getTeacher(newcourse.teacher);
                        let teacherId = parseInt(req.body.teacher[i]);
                        let teacher = await teacherModel.findOne({id: teacherId});

                        if (teacher) {
                            validos.push(teacher);
                        } else {
                            invalidos.push(req.body.teacher[i]); //retorna id de professor inválido
                        }
                    }
                    course.teacher = validos; //retorna corpo de professores validos
                    let alterCourse = new Course(course);
                    alterCourse.validate(error => {
                        // console.log(error);
                        // console.log('?>>>>>>>',course.teacher);
                        if (!error) {
                            return courseModel.update(where, {$set: course})
                                .then(result => {
                                    //console.log(result)
                                    res.status(200).json('Curso ediatdo com sucesso!');
                                })
                                .catch(err => {
                                    console.error("Erro ao conectar a collection course: ", err);
                                    res.status(500);
                                });
                        } else {
                            res.status(401).json('Não foi possível editar o Curso');
                        }
                    });
                }

            })();

        }else{
            res.status(401).json('Campos obrigatórios não preenchidos ou preenchidos de forma incorreta');
        }

    });

    /* if (req.body.name && req.body.city){
        let id = parseInt(req.params.id);
        let alterCourse = req.body;
        alterCourse.id = parseInt(req.params.id);
        alterCourse.name = req.body.name;
        alterCourse.period = req.body.period || 8;
        alterCourse.city = req.body.city;
        alterCourse.status = 1;

        (async function() {

            let validos = [];
            let invalidos = [];

            //IF INFORM TEACHER, GET TEACHER ID
            if(req.body.teacher){
                for (let i = 0; i <req.body.teacher.length; i++) {
                    //let teacherId = parseInt(req.body.teacher[i]);
                    //let teacher = await teacherModel.getTeacher({ "id": alterCourse.teacher });

                    let teacherId = parseInt(req.body.teacher[i]);
                    let teacher = await teacherModel.findOne({ id: teacherId });

                    // console.log(teacher);
                    if (teacher != null) {
                        validos.push(teacher);
                    }
                    else {
                        invalidos.push(req.body.teacher[i]); //retorna id de professor inválido
                    }
                }
                alterCourse.teacher = validos; //retorna corpo de professores validos
            }

            if (alterCourse.teacher.length < 2){
                return res.status(401).json('O curso deverá ter ao menos dois professores válidos.');
            }

            let query = { id: parseInt(req.params.id), status: 1 };
            // updates the course if it exists and it is active
            courseModel.update(query, alterCourse)
                .then(result => {
                // console.log(result.value, '<<<<<<<<<<<')
                    // if (result.value) {

                        // updates all students that have this course with the updated data about it
                        studentModel.updateCourse(parseInt(req.params.id), result.value);
                            // .then(result => {

                                // If some invalid teacher id was informed
                                if (invalidos.length > 0)
                                    return res.status(201).json(`Curso Atualizado com Sucesso. Os ids dos professores não foram encontrados: ${invalidos}`);

                                //console.log(`INF: Curso Atualizado`);
                                res.status(200).json(`Curso Atualizado`);

                            // })
                            // .catch(err => {
                                // console.error(err);
                            // });

                    //} else {
                    //     console.log('Curso não Encontrado.');
                    //     res.status(404).json('Curso não Encontrado.');
                    // }

                })
                .catch(err => {
                    console.error("Erro ao conectar a collection course", err);
                    res.status(500).json("Erro ao conectar a collection course");
                });

        })();
    } */
};
//------METHOD PUT FOR COURSE-----UPDATES NEW COURSE

//------METHOD DELETE FOR COURSE-----CHANGE THE STATUS 1 TO 0
exports.deleteCourse =  (req, res) => {
    let where = {'id': parseInt(req.params.id),'status':1};
    let set = {status:0};

    // const session = await mongoose.startSession();
    // session.startTransaction();
    //
    // try {
    //
    //     let result = await courseModel.delete(where, set);
    //
    //     if (result) {
    //         await studentModel.deleteCourse(parseInt(req.params.id));
    //         res.status(200).json('O curso foi removido com sucesso');
    //     } else {
    //         res.status(204).json('Nenhum curso foi removido');
    //     }
    //
    //
    // } catch (error) {
    //     console.error('Erro ao conectar a collection course:', error);
    //     res.status(500);
    //     await session.abortTransaction();
    //     session.endSession();
    //     throw error;
    // }


    courseModel.delete(where, set)
        .then(async (result) => {
            let result2 = await studentModel.deleteCourse(parseInt(req.params.id))

            //console.log("DELETE NO CURSO >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", result2);
            if(result){
                //console.log('O curso foi removido');
                res.status(200).json('O curso foi removido com sucesso');
            }else{
                //console.log('Nenhum curso foi removido');
                res.status(204).json('Nenhum curso foi removido');
            }
        })
        .catch(err => {
            console.error('Erro ao conectar a collection course:', err);
            res.status(500);
        });
};
//------METHOD DELETE FOR COURSE-----CHANGE THE STATUS 1 TO 0


