var chai = require('chai');
const request = require('supertest');
var assert = chai.assert;
let app = require('../index');

    describe('POST for user', function () {

        it("should not register an user if it is guess or admin ", function () {
            return request(app)
                .post('/api/v1/user')
                .send({name: "Test User", lastName:"Test Lastname", profile:"unauthorized"})
                .then(function (res) {
                    assert.equal(res.status, 401);
                });
        });

        it('should register an user if it is guess', function () {
            return request(app)
                .post('/api/v1/user')
                .send({name:"Test2 User", lastName:"Test lastName", profile:"guess"})
                .then(function (res) {
                    assert.equal(res.status, 201);
                })
        });

        it('should register an user if it is admin', function () {
            return request(app)
                .post('/api/v1/user')
                .send({name:"Test3 User", lastName:"Test lastName", profile:"admin"})
                .then(function (res) {
                    assert.equal(res.status, 201);
                })
        });

    });

    describe('GET for User', function () {
        it('should return ok status', function () {
            return request(app)
                .get('/api/v1/user')
                .then(function (res) {
                    assert.equal(res.status, 200);
                });
        });

        it('should return ok status for One user', function () {
            return request(app)
                .get('/api/v1/user/15')
                .then(function (res) {
                    assert.equal(res.status, 200);
                });
        });

        it('should return 404 status for wrong user', function () {
            return request(app)
                .get('/api/v1/user/0')
                .then(function (res) {
                    assert.equal(res.status, 404);
                });
        });

    });
    
    describe('PUT for User', function () {
        it("should NOT update an user from guess or admin ", function () {
            return request(app)
                .put('/api/v1/user/1')
                .send({name: "Update User", lastName:"Test Lastname", profile:"unauthorized"})
                .then(function (res) {
                    assert.equal(res.status, 401);
                });
        });

        it("should update an user from guess or admin ", function () {
            return request(app)
                .put('/api/v1/user/1')
                .send({name: "Update2 User", lastName:"Test Lastname", profile:"guess"})
                .then(function (res) {
                    assert.equal(res.status, 201);
                });
        });

        it("should update an user from guess or admin ", function () {
            return request(app)
                .put('/api/v1/user/1')
                .send({name: "Update3 User", lastName:"Test Lastname", profile:"admin"})
                .then(function (res) {
                    assert.equal(res.status, 201);
                });
        });

    });

    describe('DELETE for User', function () {
        xit('should delete the user (status 1 to 0)', function () {
            return request(app)
                .delete('/api/v1/user/20')
                .then(function (res) {
                    assert.equal(res.status, 200);
                });
        });

    });

