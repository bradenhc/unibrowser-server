const request = require('supertest');
var app = require('../src/index');

describe('Unibrowser Free Food API', () => {
    it('should respond with results in the correct format', (done) => {
        request(app)
            .get('/api/freefood')
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(200)
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    throw err;
                }

                res.body.forEach((element) => {
                    element.should.have.property("_id");
                    element.should.have.property("event_date");
                    element.should.have.property("id");
                    element.should.have.property("url");
                    element.should.have.property("screen_name");
                    element.should.have.property("media_url");
                    element.should.have.property("description");
                    element.should.have.property("location");
                });

                done();
            });
    });
});