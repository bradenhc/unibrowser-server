const request = require('supertest');
var app = require('../src/index');
const expect = require('chai').expect;

describe('Unibrowser Sports API', () => {
    it('should respond with correctly formatted results', done => {
        request(app)
            .get('/api/sports')
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                // TODO: setup structure of data. It is currently not defined on the Python side, so we can't
                // explicitly test it here.
                expect(res.body).to.not.have.length(0);

                done();
            });
    });
});
