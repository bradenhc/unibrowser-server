const assert = require('assert');
const mongo = require('../src/mongo');

describe('mongo.js', () => {
    describe('#get', () => {
        it('should return a list of documents', done => {
            mongo.get('locations', (err, docs) => {
                if (err) return done(err);
                assert(docs != null);
                done();
            });
        });
    });
});
