//import Modules
var fs = require('fs'),
	logger = require('js-logger'),
	mongoose = require('mongoose');
var assert = require('assert');
var data = fs.readFileSync('config.json', 'utf8');
var config = JSON.parse(data);
const Professor = require(config.rootDir+'/models/Professor.js');

// Getting the database up and running
var dbString = "mongodb://" +
    config.dbUsername + ':' +
    config.dbPassword + '@' +
    config.dbUrl + ":" +
    config.dbPort + "/" +
    config.dbName;

mongoose.connect(dbString, function(error) {
  if (!error) {
    logger.info('local mongodb connected');
  } else {
      logger.error(dbString + ' mongodb not connected ' + error);
    }
});

// Describe tests
describe("Saving records", function() {

	// Create tests
	it("Save a record to the database", function(done) {
		
		var Prof = new Professor({
			Heading : "String",
			Content : "String",
			URL : "String",
			Tags : ["Array"],
			Rank : 1
		});
		
		Prof.save(err => {
			if (err) console.log("error occured", err);
			else {
				console.log("saved test prof");
			}
		}).then(function() {			
			assert.equal(Prof.isNew, false); //returns False if it has been saved to the DB
			done();	
		});

	});

});