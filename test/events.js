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
    db = require("mongodb"),
    mongodb = require('mongodb'),
	should = require('chai').should(),
    MongoClient = mongodb.MongoClient,
	data = fs.readFileSync('./config.json', 'utf8');
    config = JSON.parse(data);
var url = "mongodb://" +
    config.dbUrl + ":" +
    config.dbPort + "/" +
    config.dbName;

MongoClient.connect(url, function (err, database) {
    if (err) {
        throw err;
    }
    else {
        db = database;
        console.log("connected to DB");
    }
});

describe('/freefood route', () => {
	it('Check if the results are being retrieved in the correct format', (done) => {
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

describe('/events route', () => {
	it('Check if the results are being retrieved in the correct format', (done) => {
	   request(app)
		   .get('/api/events')
		   .expect('content-type', 'application/json; charset=utf-8')
		   .expect(200)
		   .end((err, res) => {
				if (err) {
				   console.log(err);
				   throw err;
				}

			res.body.forEach((element) => {
					element.should.have.property("_id");
					element.should.have.property("title");
					element.should.have.property("published_parsed");
					element.should.have.property("link");
					element.should.have.property("media_content");
					// element.should.have.property("tags");
				});

			done();
		});
	});
});
