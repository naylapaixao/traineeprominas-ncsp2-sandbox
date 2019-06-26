const express = require('express');
const router = express.Router();
const  courseConsult = require('./course');
const mongoClient = require('mongodb').MongoClient;
const mdbURL = "mongodb+srv://nayla:scoat123@cluster0-lrlqp.mongodb.net/test?retryWrites=true";
var db; //variavel global que pode ser vista por outras rotas
var collection;

var id=0; //contador id

var students = [];


//CONECT TO MONGODB
mongoClient.connect(mdbURL, {native_parser:true},(err,database) => {
    if(err){
        console.error("Ocorreu um erro ao conectar mongoDB")
        send.status(500); //internal server error
    }
    else {
        db = database.db('trainee-prominas');
        collection = db.collection('student');
        db.collection('student').find({}).toArray((err, student) =>{id = student.length});
    }
    db = database.db('trainee-prominas');
});



// GET ALL STUDENTS
router.get('/', function (req, res) {
    //res.json(students);
    collection.find({}, {projection: {_id:0, id:1, name:1, lastName:1, age:1, course:1}}).toArray((err, users) =>{
        if(err) {
            console.error('Ocorreu um erro ao conectar ao User');
            res.status(500);
        }
        else {
            res.json(users);
        }
    });
});

// CREATE NEW STUDENT
router.post('/', function (req, res) {
    if (req.body.name && req.body.lastName && req.body.age && req.body.course) {

        let newstudent = req.body;
        newstudent.id = ++id;
        newstudent.status = 1;
        (async function () {
            //let courseId = await getCourse(parseInt(req.body.course));

            for (let i = 0; i < newstudent.course.length; i++) {
               let course = await getCourse(newstudent.course[i]);
               newstudent.course[i] = course;

               if(!course){
                   return res.status(401).json("Curso Inválido!");
               }
           }

            db.collection('student').insertOne(newstudent, (err, result) => {

                if (err) {
                    console.error("Erro ao Criar Um Novo Estudante", err);
                    res.status(500).json("Erro ao Criar Um Novo Estudante");
                } else {
                    res.status(201).json("Estudante Cadastrado com Sucesso.");
                }
            });

        })()
    }
    else {
        res.status(401);
        res.json('Insira todos os campos obrigatorios');
    }

    /*let newstudent = req.body;

    (async function() {

        for (let i = 0; i < newstudent.course.length; i++) {
            let courseId = await getCourse(newstudent.course[i]);
            newstudent.course[i] = courseId;
        }

        db.collection('student').insertOne(newstudent, (err, result) => {

            if (err) {
                console.error("Erro ao Criar Um Novo Estudante", err);
                res.status(500).json("Erro ao Criar Um Novo Estudante");
            } else {
                res.status(201).json("Estudante Cadastrado com Sucesso.");
            }
        });

    })(); */

    //for (var i=0;i<newstudent.course.length;i++){
        //var courseId = newstudent.course[i];
    /*var courseId = newstudent.course;
    newstudent.course = courseConsult.getCourse(courseId);
    //}
    db.collection('student').insert(newstudent);
    res.json('Usuario Cadastrado com sucesso'); */
});

// FUNCTION TO GET IDCOURSE AND INFORMATIONS ABOUT IT
const getCourse = function(id) {

    return new Promise((resolve, reject) => {

        db.collection('course').findOne({ "id" : id }, (err, course) => {
            if (err){
                return reject(err);
            }
            else{
                return resolve(course);
            }
        });

    });
};

// UPDATE STUDENT
router.put('/:id', function (req, res) {
    if (req.body.name && req.body.lastName && req.body.age && req.body.course){
        let id = parseInt(req.params.id);
        let alterStudent = req.body;
        alterStudent.id = parseInt(req.params.id);
        alterStudent.name = req.body.name;
        alterStudent.lastName = req.body.lastName;
        alterStudent.age = req.body.age;
        alterStudent.course = req.body.course;
        alterStudent.status = 1;

        (async function() {

            for (let i = 0; i < alterStudent.course.length; i++) {
                let courseId = await getCourse(alterStudent.course[i]);
                alterStudent.course[i] = courseId;
            }

            db.collection('student').findOneAndUpdate({"id":id, "status":1}, {$set:{...alterStudent}}, function (err, result) {

                if (err) {
                    console.error("Erro ao Criar Um Novo Estudante", err);
                    res.status(500).json("Erro ao Criar Um Novo Estudante");
                } else {
                    res.status(201).json("Estudante Editado com Sucesso.");
                }
            });

        })();
    }
    else{
        res.status(401);
        res.json('Insira todos os campos obrigatorios');
    }


    /* if(bodyuser == {}){
        res.status('400');
        res.json('Solicitação não autorizada')
    }
    else {

        (async function() {

            for (let i = 0; i < bodyuser.course.length; i++) {
                let courseId = await getCourse(bodyuser.course[i]);
                bodyuser.course[i] = courseId;
            }

            db.collection('student').update({'id':id},bodyuser, (err, result) => {

                if (err) {
                    console.error("Erro ao Criar Um Novo Estudante", err);
                    res.status(500).json("Erro ao Criar Um Novo Estudante");
                } else {
                    res.status(201).json("Estudante Editado com Sucesso.");
                }
            });

        })();
    } */
});

//GET ONE STUDENT
router.get('/:id', function (req, res) {
    let id = parseInt(req.params.id); //o parametro name tem que ser exatamente o mesmo que na rota

    collection.find({'id':id}, {projection: {_id:0, id:1, name:1, lastName:1, age:1, course:1}}).toArray((err, user) =>{
        if(err) {
            console.error('Ocorreu um erro ao conectar ao Student');
            res.status(500);
        }
        else {
            if (user == []){
                res.status(404);
                res.json('Estudante não encontrado');
            }
            else {
                res.json(user);
            }
        }
    });

    /* var id = req.params.id; //o parametro name tem que ser exatamente o mesmo que na rota
    var filterestStudents = students.filter((s) => {return (s.id == id); });
    if (filterestStudents.length >= 1)
        res.json(filterestStudents[0]);
    else
        res.status(404);
        res.json('Usuário não encontrado '); */
});

//DELETE ALL
/*router.delete('/', function (req, res) {
    collection.remove({}, function (err, info) { //true: remove apenas 1 false: remove todos
        if (err){
            console.error('Ocorreu erro');
            res.status(500);
        }
        else {
            var numRemoved = info.result.n; //n: é um numero

            if (numRemoved > 0){
                console.log("INF: Todos os estudantes (" + numRemoved + ") foram removidos");
                res.status(204);
                res.json('Todos os estudantes removidos com sucesso');
            }
            else {
                res.json('Nenhum estudante foi removido');
                res.status(404);
            }
        }
    });
}); */

//DELETE STUDENT (CHANGE THE STATUS 1 TO 0)
router.delete('/:id', function (req, res) {
    let id = parseInt(req.params.id);

    db.collection('student').findOneAndUpdate({'id':id, 'status':1}, {$set:{status:0}}, function (err, info) {
        if (err){
            console.error('Ocorreu erro');
            res.status(500);
        }
        else {
            //var numRemoved = info.result.n; //n: é um numero

            if (info.value != null){
                console.log("INF: Estudante foram removidos");
                res.status(200);
                res.json(' Estudante removido com sucesso');
            }
            else {
                res.json('Nenhum estudante foi removido');
                res.status(404);
            }
        }
    });

    /* var id = req.params.id;
    var deleteStudent = students.filter((c) => {return (c.id == id); });
    if (deleteStudent.length >= 1) {
        for(var i=0;i<students.length;i++){
            if (students[i].id == id){
                students.splice(i,1);
                res.json('Deletado com sucesso ');
            }
        }
    }
    else
        res.json('Estudante não encontrado '); */
});

module.exports = router;