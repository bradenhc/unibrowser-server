// include modules
var express = require('express'),
    // Instantiating express module
    app = express(),
    path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    logger = require('js-logger'),
    less = require('less-middleware'),
    unibrowseRouter = require('../routes/unibrowse'),
    db,
    mongodb = require('mongodb'),
    MongoClient = mongodb.MongoClient;

app.use('/app/', unibrowseRouter);

// Compile and serve CSS
app.use(less(path.join(__dirname,'source','less'),{
    dest: path.join(__dirname, 'public'),
    options: {
        compiler: {
            compress: false,
        },
    },
    preprocess: {
        path: function(pathname, req) {
            return pathname.replace('/css/','/');
        },
    },
    force: true,
}));

// Serve static content
app.use(express.static(path.join(__dirname, 'public')));

var data = fs.readFileSync('config.json', 'utf8');
var config = JSON.parse(data);

// Getting the database up and running
var dbString = "mongodb://" +
    config.dbUsername + ':' +
    config.dbPassword + '@' +
    config.dbUrl + ":" +
    config.dbPort + "/" +
    config.dbName;

var url = "mongodb://" +
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

const Professor = require(config.rootDir+'/models/Professor.js');

// Route the HTTP GET request
app.get("/home",function(req,res){
  console.log("This is the home page!");
  // nothing special to do here yet
});

console.log(dbString);

MongoClient.connect(url, function (err, database) {
    if (err) {
    throw err;
    }
    else {
        db = database;
        console.log("connected to DB");
    }
});

// setup server
var server = app.listen(8081);
// console.log(app._router.stack);

module.exports = app;
