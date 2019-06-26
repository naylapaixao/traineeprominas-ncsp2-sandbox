// require("dotenv-safe").load();
// var jwt = require('jsonwebtoken');
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');

const express = require('express');
const bodyParser = require('body-parser');

const userRouter = require('./routes/users');
const teacherRouter = require('./routes/teachers');
const courseRouter = require('./routes/courses');
const studentRouter = require('./routes/students');
// const loginRouter = require('./routes/login');

const app = express();

const conn = require('./config');
const cors = require('cors');

conn();

// function verifyJWT(req, res, next){
//   var token = req.headers['x-access-token'];
//   if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
//   jwt.verify(token, process.env.SECRET, function(err, decoded) {
//     if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    
//     // se tudo estiver ok, salva no request para uso posterior
//     req.userId = decoded.id;
//     next();
//   });
// }


//teste
const baseApi = "/api/v1";

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());

app.get(baseApi, function (req, res) {
  res.json('NodeJs Trainee!');
});

// Rotas da Tarefa 02
app.use(`${baseApi}/user`, userRouter);
app.use(`${baseApi}/JSON/user`, userRouter);

app.use(`${baseApi}/teacher`, teacherRouter);
app.use(`${baseApi}/JSON/teacher`, teacherRouter);

app.use(`${baseApi}/course`, courseRouter);
app.use(`${baseApi}/JSON/course`, courseRouter);

app.use(`${baseApi}/student`, studentRouter);
app.use(`${baseApi}/JSON/student`, studentRouter);

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on PORT ${listener.address().port}`);
});

module.exports = app;