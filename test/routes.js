process.env.NODE_ENV = 'test';

var request = require('supertest');
var should = require('chai').should();

describe("Route tests", () => {
    server = require('../src/server');
    describe("/rides route", () => {
        describe("Initial GET", () => {
            it("Should have status 200", (done) => {
                request(server)
                .get('/api/rides')
                .end((req, res) => {
                    res.status.should.equal(200);
                    done();
                });
            });
            it("Should have no rides stored", (done) => {
                request(server)
                .get('/api/rides')
                .end((req, res) => {
                    res.body.should.have.lengthOf(0);
                    done();
                });
            });
        });
    });
});
