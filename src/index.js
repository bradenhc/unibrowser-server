// include modules
var express = require('express'),
    app = express(),
    path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    logger = require('js-logger'),
    less = require('less-middleware');

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

mongoose.connect(dbString, function(error) {
  if (!error) {
    logger.info('local mongodb connected');
  } else {
      logger.error(dbString + ' mongodb not connected ' + error);
    }
});


// Route the HTTP GET request
app.get("/",function(req,res){
    res.contentType('text/html');
    res.sendFile(config.rootDir + 'SearchPage.html');
});

// setup server
var server = app.listen(1337);
