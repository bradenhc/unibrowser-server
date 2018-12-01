const request = require('supertest');
var app = require('../src/index');
const expect = require('chai').expect;

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

                // Check the format of each element
                res.body.forEach(doc => {
                    expect(doc._id).to.not.be.undefined;
                    expect(doc.title).to.not.be.undefined;
                    expect(doc.date).to.not.be.undefined;
                    expect(doc.lat).to.not.be.undefined;
                    expect(doc.long).to.not.be.undefined;
                    expect(doc.link).to.not.be.undefined;
                    expect(doc.image_url).to.not.be.undefined;
                    expect(doc.tags).to.not.be.undefined;
                })

                done();
            });
    });
});
