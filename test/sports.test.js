const request = require('supertest');
var app = require('../src/index');

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

                res.body.forEach(element => {
                    element.should.have.property('_id');
                    element.should.have.property('details');
                    element.should.have.property('sport');
                    element.should.have.property('s_id');
                    // element.should.have.property("address");
                });

                done();
            });
    });
});
