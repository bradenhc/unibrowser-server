const request = require('supertest');
var app = require('../src/index');

describe('Unibrowser Events API', () => {
    it('should respond with results in correct format', done => {
        request(app)
            .get('/api/events')
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(200)
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    throw err;
                }

                res.body.forEach(element => {
                    element.should.have.property('_id');
                    element.should.have.property('title');
                    element.should.have.property('published_parsed');
                    element.should.have.property('link');
                    element.should.have.property('media_content');
                    // element.should.have.property("tags");
                });

                done();
            });
    });
});
