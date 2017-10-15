process.env.NODE_ENV = 'test';

var request = require('supertest');
var assert = require('chai').assert;

describe("Route tests", () => {
    server = require('../src/server');
    describe("/rides route", () => {
        it("Should return status 200 on GET", (done) => {
            request(server)
            .get('/rides')
            .end((req, res) => {
                assert.equal(res.status, 200);
                done();
            });
        });
    }); 
});
