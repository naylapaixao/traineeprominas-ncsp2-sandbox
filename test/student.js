var chai = require('chai');
const request = require('supertest');
var assert = chai.assert;
let app = require('../index');


describe('POST for Student', function () {

    it("should register an student with age >=17 and has a valid course ", function () {
        return request(app)
            .post('/api/v1/student')
            .send({name: "Test1 student", lastName:"surname", age:17, course:1})
            .then(function (res) {
                assert.equal(res.status, 201);
            });
    });

    it("should not register an student with age >=17 and has no valid course ", function () {
        return request(app)
            .post('/api/v1/student')
            .send({name: "Test2 student", lastName:"surname", age:18, course:0})
            .then(function (res) {
                assert.equal(res.status, 401);
            });
    });

    it("should not register an student with age < 17 and has valid course ", function () {
        return request(app)
            .post('/api/v1/student')
            .send({name: "Test3 student", lastName:"surname", age:16, course:1})
            .then(function (res) {
                assert.equal(res.status, 401);
            });
    });

    it("should not register an student with age < 17 and has no valid course ", function () {
        return request(app)
            .post('/api/v1/student')
            .send({name: "Test4 student", lastName:"surname", age:16, course:0})
            .then(function (res) {
                assert.equal(res.status, 401);
            });
    });

});

    describe("GET for student", function () {
        it('should return ok status', function () {
            return request(app)
                .get('/api/v1/student')
                .then(function (res) {
                    assert.equal(res.status, 200);
                });
        });

        it('should return ok status for One student', function () {
            return request(app)
                .get('/api/v1/student/6')
                .then(function (res) {
                    assert.equal(res.status, 200);
                });
        });

        it('should return 404 status for wrong student', function () {
            return request(app)
                .get('/api/v1/course/0')
                .then(function (res) {
                    assert.equal(res.status, 404);
                });
        });
    });

    describe("PUT for student", function () {
        it('should register an student with age >=17 and has a valid course', function () {
            return request(app)
                .put('/api/v1/student/1')
                .send({name: "Update student", lastName:"surname", age:17, course:1})
                .then(function (res) {
                    assert.equal(res.status, 201);
                });
        });

        it("should not register an student with age >=17 and has no valid course ", function () {
            return request(app)
                .put('/api/v1/student/7')
                .send({name: "Update2 student", lastName:"surname", age:18, course:0})
                .then(function (res) {
                    assert.equal(res.status, 401);
                });
        });

        it("should not register an student with age < 17 and has valid course ", function () {
            return request(app)
                .put('/api/v1/student/22')
                .send({name: "Update3 student", lastName:"surname", age:16, course:4})
                .then(function (res) {
                    assert.equal(res.status, 401);
                });
        });

        it("should not register an student with age < 17 and has no valid course ", function () {
            return request(app)
                .put('/api/v1/student/22')
                .send({name: "Update4 student", lastName:"surname", age:16, course:0})
                .then(function (res) {
                    assert.equal(res.status, 401);
                });
        });

    });

    describe("DELETE for student", function () {
        xit('should delete the user (status 1 to 0)', function () {
            return request(app)
                .delete('/api/v1/student/17')
                .then(function (res) {
                    assert.equal(res.status, 200);
                });
        });

        it('should return 204 status to not found course', function () {
            return request(app)
                .delete('/api/v1/student/0')
                .then(function (res) {
                    assert.equal(res.status, 204);
                });
        });
    });