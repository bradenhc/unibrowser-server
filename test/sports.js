var assert = require('assert');
const request = require('supertest');
var app = require('../src/index');
var express = require('express'),
    unibrowseRouter = express.Router(),
    path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    logger = require('js-logger'),
    less = require('less-middleware'),
    db,
    mongodb = require('mongodb'),
	should = require('chai').should(),
    MongoClient = mongodb.MongoClient,
	data = fs.readFileSync('./config.json', 'utf8');
    config = JSON.parse(data);
var url = "mongodb://" +
    config.dbUrl + ":" +
    config.dbPort;



describe('Testing Route', () => {

	before(function (done) {
		  MongoClient.connect(url, function (err, database) {
		    if (err) {
		        throw err;
		    }
		    else {
		        db = database.db(config.dbName);
		        console.log("connected to DB");
		    }
			      done();
	    		});
	 });
	
	describe('/sports route', () => {
		it('Check if the results are being retrieved in the correct format', (done) => {
		   request(app)
			   .get('/api/sports?query=0')
			   .expect('content-type', 'application/json; charset=utf-8')
			   .expect(200)
			   .end((err, res) => {
					if (err) {
					   console.log(err);
					   throw err;
					}

				res.body.forEach((element) => {
						element.should.have.property("_id");
						element.should.have.property("details");
						element.should.have.property("sport");
						element.should.have.property("s_id");
						// element.should.have.property("address");

					});

				done();
			});
		});
	});
});