"use strict";
const assert = require('assert');
const mongo = require('../src/mongo');

describe('mongo.js', () => {
    describe('#get', () => {
        it('Check if the get is returning some cursor', (done) => {
            const cursor = mongo.get('locations', {});
            cursor.on('error', err => done(err));
            assert(cursor != null);
            done();
        });
    });
});
