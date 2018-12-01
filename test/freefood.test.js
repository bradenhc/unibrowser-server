const request = require('supertest');
var app = require('../src/index');
const expect = require('chai').expect;

describe('Unibrowser Free Food API', () => {
    it('should respond with results in the correct format', done => {
        request(app)
            .get('/api/freefood')
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(200)
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    throw err;
                }

                res.body.forEach(doc => {
                    expect(doc._id).to.not.be.undefined;
                    expect(doc.title).to.not.be.undefined;
                    expect(doc.date).to.not.be.undefined;
                    expect(doc.description).to.not.be.undefined;
                    expect(doc.location).to.not.be.undefined;
                    expect(doc.link).to.not.be.undefined;
                    expect(doc.media_url).to.not.be.undefined;
                });

                done();
            });
    });
});
