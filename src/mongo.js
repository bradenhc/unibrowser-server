const mongodb = require('mongodb');
const config = require('config');
const _config = config.get('database');

// This is our initial database connection. It will be null until we connect successfully to the MongoDB instance.
// Once we have connected successfully, then we con begin serving requests.
let db = null;
const url = `mongodb://${_config.host}:${_config.port}`;
const client = new mongodb.MongoClient(url, { useNewUrlParser: true });
client.connect(err => {
    if (err) {
        console.error('Failed to connect to Mongo: ' + err.message);
        return;
    }
    db = client.db(_config.name);
    console.log('Connected to MongoDB at ' + url);
});

const getDocuments = (collection, query, projection, sort, cb) => {
    if (typeof query === 'function') {
        cb = query;
        projection = {};
        query = {};
    } else if (typeof projection === 'function') {
        cb = projection;
        projection = {};
    } else if (typeof sort === 'function') {
        cb = sort;
        sort = null;
    }
    if (!db) return cb(new Error('DB not connected'));
    if (sort) {
        db.collection(collection)
            .find(query, projection)
            .sort(sort)
            .toArray((err, docs) => {
                cb(err, docs);
            });
    } else {
        db.collection(collection)
            .find(query, projection)
            .toArray((err, docs) => {
                cb(err, docs);
            });
    }
};

// Gracefully exit when we need to
process.on('SIGINT', () => {
    console.log('\nClosing DB connection');
    client.close();
    console.log('Closed');
    process.exit(0);
});

module.exports = {
    get: getDocuments
};
