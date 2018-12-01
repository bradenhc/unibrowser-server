const expect = require('chai').expect;
const request = require('supertest');
const app = require('../src/index');

// Describe tests
describe('Unibrowser Professors API', function() {

	// TODO: Add a before() statement here to prep the database

    it('should respond with a professor record', done => {
        request(app)
            .get('/api/professors?name=John')
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(200)
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    throw err;
                }

                expect(res.body).to.exist();
                expect(res.body[0]).to.exist();
                expect(res.body[0].name).to.exist();
                done();
            });
        done();
    });
});
