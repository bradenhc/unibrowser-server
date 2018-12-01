const expect = require('chai').expect;
const request = require('supertest');
const app = require('../src/index');

// Describe tests
describe('Unibrowser Professors API', () => {
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

                res.body.forEach(doc => {
                    expect(doc._id).to.not.be.undefined;
                    expect(doc.name).to.not.be.undefined;
                    expect(doc.research).to.not.be.undefined;
                    expect(doc.contact).to.not.be.undefined;
                });
                done();
            });
    });
});
