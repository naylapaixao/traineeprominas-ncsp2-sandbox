var chai = require('chai');
const request = require('supertest');
var assert = chai.assert;
let app = require('../index');


    describe('POST for teacher', function () {

        it("should not register an user if phd = false ", function () {
            return request(app)
                .post('/api/v1/teacher')
                .send({name: "Test1 Teacher", lastName:"Test Lastname", phd:false})
                .then(function (res) {
                    assert.equal(res.status, 401);
                });
        });

        it("should register a teacher if phd = true ", function () {
            return request(app)
                .post('/api/v1/teacher')
                .send({name: "Test2 Teacher", lastName:"Test Lastname", phd:true})
                .then(function (res) {
                    assert.equal(res.status, 201);
                });
        });

        it("should register a teacher if phd = true ", function () {
            return request(app)
                .post('/api/v1/teacher')
                .send({name: "Test3 Teacher", lastName:"Test Lastname", phd:true})
                .then(function (res) {
                    assert.equal(res.status, 201);
                });
        });

    });

    describe("GET for teacher", function () {
        it('should return ok status', function () {
            return request(app)
                .get('/api/v1/teacher')
                .then(function (res) {
                    assert.equal(res.status, 200);
                });
        });

        it('should return ok status for One user', function () {
            return request(app)
                .get('/api/v1/teacher/10')
                .then(function (res) {
                    assert.equal(res.status, 200);
                });
        });

        it('should return 404 status for wrong user', function () {
            return request(app)
                .get('/api/v1/teacher/0')
                .then(function (res) {
                    assert.equal(res.status, 404);
                });
        });
    });

    describe("PUT for teacher", function () {
        it('should NOT update an user if phd = false ', function () {
            return request(app)
                .put('/api/v1/teacher/1')
                .send({name: "Update Teacher", lastName:"Test Lastname", phd:false})
                .then(function (res) {
                    assert.equal(res.status, 401);
                });
        });

        it("should register a teacher if phd = true ", function () {
            return request(app)
                .put('/api/v1/teacher/5')
                .send({name: "Update2 Teacher", lastName:"Test Lastname", phd:true})
                .then(function (res) {
                    assert.equal(res.status, 201);
                });
        });

        it("should register a teacher if phd = true ", function () {
            return request(app)
                .put('/api/v1/teacher/6')
                .send({name: "Update3 Teacher", lastName:"Test Lastname", phd:true})
                .then(function (res) {
                    assert.equal(res.status, 201);
                });
        });
    });

    describe("DELETE for teacher", function () {
        xit('should  delete the user (status 1 to 0)', function () {
            return request(app)
                .delete('/api/v1/teacher/21')
                .then(function (res) {
                    assert.equal(res.status, 200);
                });
        });

        it('should return 204 status to not found teacher', function () {
            return request(app)
                .delete('/api/v1/teacher/0')
                .then(function (res) {
                    assert.equal(res.status, 204);
                });
        });
    });





