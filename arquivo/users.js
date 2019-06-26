const express = require('express');
const router = express.Router();

// MONGODB CONNECTION
const mongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const password = 'scoat123';
const mdbUrl = "mongodb+srv://nayla:scoat123@cluster0-lrlqp.mongodb.net/test?retryWrites=true";

let db;
let userCollection;
let counterCollection;

mongoClient.connect(mdbUrl, { native_parser: true }, (err, database) => {

  if (err) {
    console.error('Ocorreu um erro ao conectar ao mongoDB', err);
    // send.status(500);
  }
  else {
    console.log('User CONECTOU!');

    db = database.db("trainee-prominas");
    userCollection = db.collection('user');
    counterCollection = db.collection('counter');
  }
});
// MONGODB CONNECTION

router.get('/', function(req, res) {
  const projection = { _id: 0, id: 1, name: 1, lastName: 1, profile: 1 };

  userCollection.find({ status: 1 }, { projection })
    .toArray((err, users) => {
      if (err) {
        console.error("Erro ao conectar a collection 'user'", err);
        res.status(500).json("Erro ao conectar a collection 'user'");
      } else {
        res.json(users);
      }
    });
});

router.post('/', function(req, res) {
  
  // validation
  if (!req.body.hasOwnProperty('name') || !req.body.hasOwnProperty('lastName') || !req.body.hasOwnProperty('profile'))
    return res.status(401).json('Os campos name, lastName e profile são obrigatórios.');

  // if valid creates the user object
  let user = {
    name: req.body.name,
    lastName: req.body.lastName,
    profile: req.body.profile,
    status: 1
  };

  (async () => {
    
    // sets user's unique id
    user.id = await _getNextIdValue();
  
    // persists the new user on database
    userCollection.insertOne(user, (err, result) => {

      if (err) {
        console.error("Erro ao Criar Um Novo Usuário", err);
        res.status(500).json("Erro ao Criar Um Novo Usuário");
      } else {
        res.status(201).json("Usuário Cadastrado com Sucesso.");
      }
    });

  })();

});

router.delete('/:id', function(req, res) {

  let id = parseInt(req.params.id);

  // Don't actually remove just change user status
  userCollection.findOneAndUpdate({ id: id, status: 1 }, { $set: { status: 0 } }, (err, result) => {

    if (err) {
      console.error("Erro ao remover o usuário", err);
      res.status(500).json("Erro ao remover o usuário");
    } else {

      if (result.value) {
        console.log(`INF: Usuário Removido`);
        res.status(200).json(`Usuário Removido`);
      } else {
        console.log('Nenhum Usuário Removido');
        res.status(204).json('Nenhum Usuário Removido');
      }
    }

  });

});

router.get('/:id', function(req, res) {

  let id = parseInt(req.params.id);

  const projection = { _id: 0, id: 1, name: 1, lastName: 1, profile: 1 };

  userCollection.findOne({ id: id, status: 1 }, { projection }, (err, user) => {

    if (err) {
      console.error("Erro ao conectar a collection 'user'", err);
      res.status(500).json("Erro ao conectar a collection 'user'");
    } else {

      if (user)
        res.json(user);
      else
        res.status(404).json("Usuário não Encontrado.");
    }
  });

});

router.put('/:id', function(req, res) {

  // validation
  if (!req.body.hasOwnProperty('name') || !req.body.hasOwnProperty('lastName') || !req.body.hasOwnProperty('profile'))
    return res.status(401).json('Os campos name, lastName e profile são obrigatórios.');

  // if valid creates the user object
  let user = {
    name: req.body.name,
    lastName: req.body.lastName,
    profile: req.body.profile,
  };

  // collects the user's id
  let id = parseInt(req.params.id);

  // updates the user if it exists and it is active
  userCollection.findOneAndUpdate({ id: id, status: 1 }, { $set: { ...user } }, (err, result) => {

    if (err) {
      console.error("Erro ao conectar a collection 'user'", err);
      res.status(500).json("Erro ao conectar a collection 'user'");
    } else {

      if (result.value) {
        console.log(`INF: Usuário Atualizado`);
        res.status(200).json(`Usuário Atualizado`);
      } else {
        console.log('Usuário não Encontrado.');
        res.status(404).json('Usuário não Encontrado.');
      }
    }

  });

});

const _getNextIdValue = () => {

  const sequenceName = "user_id";

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
