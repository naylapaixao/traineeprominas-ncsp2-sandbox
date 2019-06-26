const userModel = require('../models/user');

//------MONGOOSE SCHEMA
const mongoose = require("mongoose");
const userSchema = require('../schema').userSchema;
const User = mongoose.model('User', userSchema);
//------MONGOOSE SCHEMA

//------JOI VALIDATION --validades all the requiments are corrects
const Joi = require('joi');
const validator = require('express-joi-validation')({});

const schemaUser = Joi.object().keys({
    name: Joi.string().required(),
    lastName: Joi.string().required(),
    profile: Joi.string().required()
});
//------JOI VALIDATION

//const User = mongoose.model('User', userSchema);

var id=0;

//------METHOD GET FOR ALL USERS-----
exports.getAllUsers = function (req, res) {
    const query = { status: 1 };
    const projection = { _id: 0, id: 1, name: 1, lastName: 1, profile: 1 };

    userModel.findAll(query, projection)
        .then(users => {
            res.json(users);
        })

        .catch(err => {
            console.error("Erro ao conectar a collection user");
            res.status(500).json("Erro ao conectar a collection user");
        });
};
//------METHOD GET FOR ALL USERS-----

//------METHOD GET FOR ONE USER-----
exports.getOneUser = function (req, res) {
    const query = { id: parseInt(req.params.id), status: 1 };
    const projection = { _id: 0, id: 1, name: 1, lastName: 1, profile: 1 };

    userModel.findOne(query, projection)
        .then(user => {
            if (user) {
                return res.json(user);
            }else {
                return res.status(404).json("Usuário não Encontrado.");
            }
        })
        .catch(err =>{
            console.error("Erro ao conectar a collection user");
            res.status(500).json("Erro ao conectar a collection user");
        });
};
//------METHOD GET FOR ONE USER-----

//------METHOD POST FOR USER-----CREATES NEW USER
exports.postUser =  (req,res) => {
    Joi.validate(req.body, schemaUser, (err, result) =>{
        if(!err){
            let user = new User ({id: ++id, name: req.body.name, lastName: req.body.lastName, status: 1, profile:req.body.profile});

            user.validate(error => {
                if(!error){
                    return userModel.insertOne(user)
                        .then(result => {
                            res.status(201).json('Usuário cadastrado com sucesso!');
                        })
                        .catch(err => {
                            console.error("Erro ao conectar a collection user: ", err);
                            res.status(500);
                        });
                }else{
                    res.status(401).json('Não foi possível cadastrar usuário profile invalido');
                }
            });
        }else{
            res.status(401).json('Campos obrigatórios não preenchidos ou preenchidos de forma incorreta');
        }
    });


    /*if (req.body.name && req.body.lastName && (req.body.profile == 'admin' || req.body.profile == 'guess')){  //(req.body.profile == true)
        let  newuser = req.body;
        newuser.id = 0;
        newuser.name =req.body.name;
        newuser.lastName = req.body.lastName;
        newuser.profile = req.body.profile;
        newuser.status = 1;

        userModel.insertOne(newuser)
            .then(user => {
                res.status(201).json("Usuário Cadastrado com Sucesso.");
            })
            .catch(err => {
                console.error("Erro ao Criar Um Novo Usuário", err);
                res.status(500).json("Erro ao Criar Um Novo Usuário");
            });
    }else {
        res.status(401).json("Não foi possível cadastrar usuário profile invalido");
    } */
};
//------METHOD POST FOR USER-----CREATES NEW USER

//------METHOD PUT FOR USER-----UPDATE NEW USER
exports.putUser = (req, res) => {

    let user = ({id: parseInt(req.params.id), name: req.body.name, lastName: req.body.lastName, status: 1, profile:req.body.profile});
    let where = { id: parseInt(req.params.id), status: 1 };
    let alteruser = new User(user);


    Joi.validate(req.body, schemaUser, (err, result) =>{
        if(!err){
            alteruser.validate(error => {
                if(!error){
                    return userModel.update(where, {$set: user})
                        .then(result => {
                            if(result){
                                res.status(201).json('Usuário editado com sucesso!');
                            }else{
                                res.status(401).json('Usuário não encontrado');
                            }
                        })
                        .catch(err => {
                            console.error("Erro ao conectar a collection user: ", err);
                            res.status(500);
                        });
                }else{
                    res.status(401).json('Não foi possível editar o usuário (profile inválido)');
                }
            })
        }else{
            res.status(401).json('Campos obrigatórios não preenchidos ou preenchidos de forma incorreta');
        }
    });

    /*if (req.body.name && req.body.lastName && (req.body.profile == 'admin' || req.body.profile == 'guess') ){
        let userAlter = req.body;
        let id = parseInt(req.params.id);
        userAlter.id = id;
        userAlter.name = req.body.name;
        userAlter.lastName = req.body.lastName;
        userAlter.profile = req.body.profile;
        userAlter.status =1;

        userModel.update(id, userAlter)
            .then(user => {
                res.status(201).json("Usuário Cadastrado com Sucesso.");
            })
            .catch(err => {
                console.error("Erro ao Criar Um Novo Usuário", err);
                res.status(500).json("Erro ao Criar Um Novo Usuário");
            });
    }else {
        res.status(401).json("Campo Inválido");
    } */
};
//------METHOD PUT FOR USER-----UPDATE NEW USER

//------METHOD DELETE FOR USER-----CHANGE THE STATUS 1 TO 0
exports.deleteUser = (req, res) =>{
    let id = parseInt(req.params.id)

    userModel.delete(id)
        .then(results => {
            if (results == null){
                res.status(204).json("Não foi possivel encontrar usuário");
            }
            else {
                res.status(200).json("Usuario excluido com sucesso");
            }
        })
        .catch(err =>{
            console.error("Ocorreu um erro ao deletar os usuarios");
            res.status(500);
        })
};
//------METHOD DELETE FOR USER-----CHANGE THE STATUS 1 TO 0