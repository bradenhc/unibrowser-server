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
const locationRouter = require('./locations');

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
// var dbString = "mongodb://" +
//     config.dbUsername + ':' +
//     config.dbPassword + '@' +
//     config.dbUrl + ":" +
//     config.dbPort + "/" +
//     config.dbName;
//
// var url = "mongodb://" +
//     config.dbUrl + ":" +
//     config.dbPort + "/" +
//     config.dbName;
//
// mongoose.connect(dbString, function(error) {
//   if (!error) {
//     logger.info('local mongodb connected');
//   } else {
//       logger.error(dbString + ' mongodb not connected ' + error);
//     }
// });
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/api', unibrowseRouter);
app.use('/locations', locationRouter);

// Route the HTTP GET request
app.get("/home",function(req,res){
  console.log("This is the home page!");
  // nothing special to do here yet
});

// setup server
var server = app.listen(8080);
// console.log(app._router.stack);

module.exports = app;
