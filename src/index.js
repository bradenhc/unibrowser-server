const express = require('express');
const app = express();
const path = require('path');
const less = require('less-middleware');
const faqRouter = require('./routes/faqs');
const profRouter = require('./routes/professors');
const freeFoodRouter = require('./routes/freefood');
const eventsRouter = require('./routes/events');
const sportsRouter = require('./routes/sports');
const locationRouter = require('./routes/locations');

// Compile and serve CSS
app.use(
    less(path.join(__dirname, 'source', 'less'), {
        dest: path.join(__dirname, 'public'),
        options: {
            compiler: {
                compress: false
            }
        },
        preprocess: {
            path: function(pathname, req) {
                return pathname.replace('/css/', '/');
            }
        },
        force: true
    })
);

// Serve static content
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use('/api', faqRouter);
app.use('/api', profRouter);
app.use('/api', eventsRouter);
app.use('/api', freeFoodRouter);
app.use('/api', sportsRouter);
app.use('/api', locationRouter);

// Route the HTTP GET request
app.get('/home', function(req, res) {
    console.log('This is the home page!');
    // nothing special to do here yet
    res.status(200).end();
});

app.use((req, res) => {
    return res.status(400).json({ message: 'Invalid request' });
});

// setup server
var server = app.listen(8080);
// console.log(app._router.stack);

module.exports = app;
