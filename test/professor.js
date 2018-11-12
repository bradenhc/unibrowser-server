//import Modules
var assert = require('assert');
const request = require('supertest');
var app = require('../src/index');
// console.log(app._router.stack);
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
    MongoClient = mongodb.MongoClient;

	var data = fs.readFileSync('./config.json', 'utf8');
    var config = JSON.parse(data);
	const Professor = require(config.rootDir+'/models/Professor.js');
	
    var url = "mongodb://" +
        config.dbUrl + ":" +
        config.dbPort;
	console.log(url);
    MongoClient.connect(url, function (err, database) {
        if (err) {
        throw err;
        }
        else {
            db = database.db(config.dbName);
            console.log("connected to DB");
        }
    });


// Describe tests
describe("Saving records", function() {

	// Create tests
	it("Save a record to the database", function(done) {

		var prof = new Professor({
			name : "Random",
			research : "AI and Machine Learning",
			contact : "Kelley Engineering Center"
		});
	
		prof.save(err => {
			if (err) console.log("error occured", err);
			else {
				console.log("saved test prof");
			}
		}).then(function() {
			assert.equal(prof.isNew, false); //returns False if it has been saved to the DB
		});
		done();
	});
});

describe('/Professor route', () => {
     it('Check using the name of the professor', (done) => {
		request(app)
			.get('/api/professors?name=John')
			.expect('content-type', 'application/json; charset=utf-8')
			.expect(200)
			.end((err, res) => {
				if (err) {
					console.log(err);
					throw err;
				}

				//var arr = res.text;
				// console.log(res.body);

				res.body.forEach((element) => {
					console.log(element);
					assert.ok(element.name.contains("Martin"));
				});

			});
		done();
	 });
});


