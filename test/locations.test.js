const request = require('supertest');
const app = require('../src/index');

describe('Unibrowser Locations API', () => {
    it('should respond with 200 OK', done => {
        request(app)
            .get('/locations')
            .expect(200)
            .expect('content-type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });
    it('should respond with 200 OK with lat lng params', done => {
        request(app)
            .get('/locations?lat=1&lng=2')
            .expect(200)
            .expect('content-type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });
});
