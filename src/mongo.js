"use strict";
const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
let db;

const fs = require('fs');
const data = fs.readFileSync('config.json', 'utf8');
const config = JSON.parse(data);

// var url = `mongodb://${config.dbUsername}:${config.dbPassword}@${config.dbUrl}:${config.dbPort}/${config.dbName}`;
const url = `mongodb://${config.dbUrl}:${config.dbPort}`;

mongoClient.connect(url, (err, database) => {
    if (err) {
        throw err;
    } else {
        db = database.db(config.dbName);
        console.log("connected to DB");
    }
});

const getDocuments = (collectionName, searchQuery = {}) => {
    return db.collection(collectionName).find(searchQuery);
};

module.exports = {
    get: getDocuments
};
