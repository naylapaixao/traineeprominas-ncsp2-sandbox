const chai = require('chai');
const assert = chai.assert;
const request = require('supertest');

const app = require('../index');

describe('Unit testing index', function() {

    this.timeout(12000);

    before(done => {

        setTimeout(() => {
            done();
        }, 10000);

    });

    it('GET index should return OK status', function() {
        return request(app)
            .get('/api/v1')
            .then(function(res){
                assert.equal(res.status, 200)
            })
    });

});
