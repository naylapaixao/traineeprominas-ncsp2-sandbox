var chai = require('chai');
const request = require('supertest');
var assert = chai.assert;
let app = require('../index');


describe('POST for Course', function () {

    it("should not register aa course if has less than 2 teachers valid ", function () {
        return request(app)
            .post('/api/v1/course')
            .send({name: "Test1 course", period:"1", teacher:[4, 0], city:"new york"})
            .then(function (res) {
                assert.equal(res.status, 401);
            });
    });

    it("should register aa course if has at least 2 teachers valid", function () {
        return request(app)
            .post('/api/v1/course')
            .send({name: "Test2 course", period:"1", teacher:[1, 2], city:"new york"})
            .then(function (res) {
                assert.equal(res.status, 201);
            });
    });

});

    describe("GET for Course", function () {
        it('should return ok status', function () {
            return request(app)
                .get('/api/v1/course')
                .then(function (res) {
                    assert.equal(res.status, 200);
                });
        });

        it('should return ok status for One user', function () {
            return request(app)
                .get('/api/v1/course/6')
                .then(function (res) {
                    assert.equal(res.status, 200);
                });
        });

        it('should return 404 status for wrong user', function () {
            return request(app)
                .get('/api/v1/course/0')
                .then(function (res) {
                    assert.equal(res.status, 404);
                });
        });
    });

    describe("PUT for Course", function () {
        it('should NOT update a course if has less than 2 teachers valid ', function () {
            return request(app)
                .put('/api/v1/course/6')
                .send({name: "Update course", period:"1", teacher:[1, 0], city:"new york"})
                .then(function (res) {
                    assert.equal(res.status, 401);
                });
        });

        it('should register a course if has at least 2 teachers valid', function () {
            return request(app)
                .put('/api/v1/course/7')
                .send({name: "Update2 course", period:"1", teacher:[1, 2], city:"new york"})
                .then(function (res) {
                    assert.equal(res.status, 200);
                });
        });

    });

    describe("DELETE for course", function () {
        xit('should delete the user (status 1 to 0)', function () {
            return request(app)
                .delete('/api/v1/course/12')
                .then(function (res) {
                    assert.equal(res.status, 200);
                });
        });

        it('should return 204 status to not found course', function () {
            return request(app)
                .delete('/api/v1/course/0')
                .then(function (res) {
                    assert.equal(res.status, 204);
                });
        });

    });