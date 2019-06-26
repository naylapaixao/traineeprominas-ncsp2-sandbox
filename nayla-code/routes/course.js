const express = require('express');
const router = express.Router();
const  teacherConsult = require('./teacher');
const mongoClient = require('mongodb').MongoClient;
const mdbURL = "mongodb+srv://nayla:scoat123@cluster0-lrlqp.mongodb.net/test?retryWrites=true";
var db; //variavel global que pode ser vista por outras rotas
var collection;

mongoClient.connect(mdbURL, {native_parser:true},(err,database) => {
    if(err){
        console.error("Ocorreu um erro ao conectar mongoDB")
        send.status(500); //internal server error
    }
    else {
        db = database.db('trainee-prominas');
        collection = db.collection('course');
        db.collection('course').find({}).toArray((err, course) =>{id = course.length});
    }
    db = database.db('trainee-prominas');
});

var id=0; //contador id

var courses = [];

//GET ALL COURSES
router.get('/', function (req, res) {
    collection.find({},{projection: {_id:0, id:1, name:1, period:1, teacher:1, city:1}}).toArray((err, users) =>{
        if(err) {
            console.error('Ocorreu um erro ao conectar ao course');
            res.status(500);
        }
        else {
            res.json(users);
        }
    });
});

// CREATE COURSE
router.post('/', function (req, res) {
   if(req.body.name && req.body.city){
       let newcourse = req.body;
       newcourse.id = ++id;
       newcourse.period = parseInt(req.body.period) || 8;
       newcourse.status = 1;

       (async function() {

           let validos = [];
           let invalidos = [];

           //IF INFORM TEACHER, GET TEACHER ID
           if(req.body.teacher){
               for (let i = 0; i < newcourse.teacher.length; i++) {
                   let teacher = await getTeacher(newcourse.teacher[i]);
                   // newcourse.teacher[i] = teacher;
                    console.log(teacher);
                   if (teacher != null) {
                       validos.push(teacher);
                   }
                   else {
                       invalidos.push(newcourse.teacher[i]); //retorna id de professor inválido
                   }
               }

               newcourse.teacher = validos; //retorna corpo de professores validos
           }

           console.log(invalidos);
           //INSERT INFO IN DB
           db.collection('course').insertOne(newcourse, (err, result) => {
               if (err) {
                   console.error("Erro ao Criar Um Novo Curso", err);
                   res.status(500).json("Erro ao Criar Um Novo Curso");
               } else {

                   if(invalidos.length == 0){
                       return res.status(201).json("Curso Cadastrado com sucesso");
                   }
                   else {
                       return res.status(201).json("Id de professor inexistente curso cadastrado");
                   }
                   res.status(201).json("Curso Cadastrado com Sucesso.");
               }
           });

       })();
   }
   else{
       res.status(401);
       res.json('Insira todos os campos obrigatorios');
   }
    /*let newcourse = req.body;
   newcourse.id = ++id;

    (async function() {

        for (let i = 0; i < newcourse.teacher.length; i++) {
            let teacherId = await getTeacher(newcourse.teacher[i]);
            newcourse.teacher[i] = teacherId;
        }

        db.collection('course').insertOne(newcourse, (err, result) => {

            if (err) {
                console.error("Erro ao Criar Um Novo Curso", err);
                res.status(500).json("Erro ao Criar Um Novo Curso");
            } else {
                res.status(201).json("Curso Cadastrado com Sucesso.");
            }
        });

    })(); */
});

// FUNCTION TO GET IDTEACHER AND INFORMATIONS ABOUT IT
const getTeacher = function(id) {

    return new Promise((resolve, reject) => {

        db.collection('teacher').findOne({ "id" : id }, (err, teacher) => {
            if (err){
                return reject(err);
            }
            else{
                return resolve(teacher);
            }
        });

    });
};

// UPDATE COURSE
router.put('/:id', function (req, res) {
    if(req.body.name && req.body.city){
        let id = parseInt(req.params.id);
        let alterCourse = req.body;
        alterCourse.id = parseInt(req.params.id);
        alterCourse.name = req.body.name;
        alterCourse.period = req.body.period || 8;
        alterCourse.city = req.body.city;
        alterCourse.status = 1;

        let ide = parseInt(req.params.id);

        (async function() {

            //IF INFORM TEACHER, GET TEACHER INFO
            if(req.body.teacher){
                for (let i = 0; i < alterCourse.teacher.length; i++) {
                    let teacherId = await getTeacher(alterCourse.teacher[i]);
                    alterCourse.teacher[i] = teacherId;
                }
            }

            db.collection('course').updateOne({"id": ide}, { $set: alterCourse }, (err, result) => {
                if (err) {
                    console.error("Erro ao Criar Um Novo Curso", err);
                    res.status(201).json("Erro ao Criar Um Novo Curso");
                } else {
                    console.log('-------------------',alterCourse);
                    db.collection('student').updateMany({ "course.id": alterCourse.id }, { $set: { "course.$": alterCourse } }, function(err_course, results){
                            if(err_course){
                                res.json("Erro na inserção do curso");
                            }
                            else if(results.matchedCount >= 0){
                                res.json("curso modificado com sucesso");
                            }
                            else{
                                res.json('Erro na modificação');
                            }
                        })
                    //res.status(201).json("Curso modificado com Sucesso.");
                }
            });

            //INSERT INFO IN DB
            /*db.collection('course').findOneAndUpdate({"id":id, "status":1}, {$set:{...alterCourse}}, function (err, result) {
                if (err) {
                    console.error("Erro ao Editar Um Novo Curso", err);
                    res.status(500).json("Erro ao Editar Um Novo Curso");
                } else {
                    res.status(201).json("Curso Cadastrado com Sucesso.");
                }
            }); */

        })();
    } else {
        res.status(403).json('Todos os dados devem ser preenchidos')
    }

    /* if(bodyuser == {}){
        res.status('400');
        res.json('Solicitação não autorizada')
    }
    else {
        (async function() {

            for (let i = 0; i < bodyuser.teacher.length; i++) {
                let teacherId = await getTeacher(bodyuser.teacher[i]);
                bodyuser.teacher[i] = teacherId;
            }

            db.collection('course').update({'id':id},bodyuser, (err, result) => {

                if (err) {
                    console.error("Erro ao editar Um Novo Curso", err);
                    res.status(500).json("Erro ao Criar Um Novo Curso");
                } else {
                    res.status(201).json("Curso Editado com Sucesso.");
                }
            });

        })();
    } */

    /* var id = req.params.id;
    var filterestCourses = courses.filter((s) => {return (s.id == id); });
    if (filterestCourses.length >= 1){
        filterestCourses[0].name = req.body.name || filterestCourses[0].name;
        filterestCourses[0].period = req.body.period || filterestCourses[0].period;
        filterestCourses[0].city = req.body.city || filterestCourses.city;

        filterestCourses[0].teacher =req.body.teacher.map(item => {
            return teacherConsult.getTeacher(item);
        });
    }
    res.json('Editado com sucesso'); */

});

// GET ONE COURSE
router.get('/:id', function (req, res) {
    let id = parseInt(req.params.id); //o parametro name tem que ser exatamente o mesmo que na rota

    collection.find({'id':id}, {projection: {_id:0, id:1, name:1, period:1, teacher:1, city:1}}).toArray((err, user) =>{
        if(err) {
            console.error('Ocorreu um erro ao conectar ao Teacher');
            res.status(500);
        }
        else {
            if (user == []){
                res.status(404);
                res.json('Professor não encontrado');
            }
            else {
                res.json(user);
            }
        }
    });

    /* var id = req.params.id; //o parametro name tem que ser exatamente o mesmo que na rota
    var filterestCourses = courses.filter((s) => {return (s.id == id); });
    if (filterestCourses.length >= 1)
        res.json(filterestCourses[0]);
    else
        res.status(404);
        res.json('Curso não encontrado '); */
});

//DELETE ALL DESUSO
/*router.delete('/', function (req, res) {
    collection.remove({}, function (err, info) { //true: remove apenas 1 false: remove todos
        if (err){
            console.error('Ocorreu erro');
            res.status(500);
        }
        else {
            var numRemoved = info.result.n; //n: é um numero

            if (numRemoved > 0){
                console.log("INF: Todos os curso (" + numRemoved + ") foram removidos");
                res.status(204);
                res.json('Todos os cursos removidos com sucesso');
            }
            else {
                res.json('Nenhum curso foi removido');
                res.status(404);
            }
        }
    });

    //courses = [];
    //res.json('Cursos removidos com sucesso ');
}); */

//DELETE COURSE (CHANGE THE STATUS 1 TO 0)
router.delete('/:id', function (req, res){ //DELETE FILTERED
    collection.findOneAndUpdate({"id":parseInt(req.params.id), "status":1}, {$set: {status:0}}, function (err, info){
        db.collection('student').findOneAndUpdate({"status":1, "course.id":parseInt(req.params.id)}, {$set: {status:0}}, (err, info) =>{
            if(err){
                console.log(err);
            }else{
                console.log("O curso foi deletado em estudante");
            }
        });
        if(err){
            console.error('Ocorreu um erro ao deletar o curso');
            res.status(500);
        }else{
            if(info.value != null){
                console.log('O curso foi removido com sucesso');
                res.status(200).json('Curso removido com sucesso');
            }else{
                console.log('Nenhum curso foi removido');
                res.status(204).json('Nenhum cursos foi removido');
            }
        }
    });
});


/*router.;delete('/:id', function (req, res) {
    let id = parseInt(req.params.id);

    db.collection('course').findOneAndUpdate({'id':id, 'status':1}, {$set:{status:0}},function(err,info) { //true: remove apenas 1 false: remove todos
        if (err){
            console.error('Ocorreu erro');
            res.status(500);
        }
        else {
            //var numRemoved = info.result.n; //n: é um numero

            if (info.value != null){
                console.log("INF: Curso foram removidos");
                res.status(200);
                res.json(' Curso removido com sucesso');
            }
            else {
                res.json('Nenhum curso foi removido');
                res.status(404);
            }
        }
    }); */

    /* var id = req.params.id;
    var deleteCourse = courses.filter((c) => {return (c.id == id); });
    if (deleteCourse.length >= 1) {
        for(var i=0;i<courses.length;i++){
            if (courses[i].id == id){
                courses.splice(i,1);
                res.json('Deletado com sucesso ');
            }
        }

    }
    else
        res.json('Curso não encontrado '); */

/* function getCourse(courseId){
    courseId = parseInt(courseId);

    for(var i=0;i<courses.length;i++){
        if(courseId == courses[i].id){
            return courses[i];
        }
    }
} */

module.exports = {router};