var request = require('supertest');
var assert = require('chai').assert;

describe("Route tests", () => {
    server = require('../src/server');
    describe("/rides route", () => {
        it("Should return status 200 on GET", (done) => {
            request(server)
            .get('/api/rides')
            .end((req, res) => {
                assert.equal(res.status, 200);
                done();
            });
        });
    }); 
});
