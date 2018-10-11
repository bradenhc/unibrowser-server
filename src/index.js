// include modules
var express = require('express'),
    app = express(),
    path = require('path'),
    fs = require('fs'),
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
var info = JSON.parse(data);

// Route the HTTP GET request
app.get("/",function(req,res){
    res.contentType('text/html');
    res.sendFile(info.rootDir + 'SearchPage.html');
});

// setup server
var server = app.listen(1337);
