"use strict";
const request = require('supertest');
const locationRouter = require('../src/locations');

describe('locations.js', () => {
    describe('route /', () => {
        it('Check if the url is responding', () => {
            request(locationRouter)
                .get('/')
                .expect(200)
                .expect('content-type', 'application/json; charset=utf-8');
        });
    });
    describe('route / with params', () => {
        it('Check if the url is responding', () => {
            request(locationRouter)
                .get('/?lat=1&lng=2')
                .expect(200)
                .expect('content-type', 'application/json; charset=utf-8');
        });
    });
});
