// Require a Schema
const mongoose = require('mongoose');

// Define a Schema
const Schema = mongoose.Schema;

// Create Schema for Buildings
var SportSchema = new Schema({
    Heading : String,
    Content : String,
    URL : String,
    Tags : Array,
    Rank : Number
});

// Compile model from Schema
var Sport = mongoose.model('Sport',SportSchema);

module.exports = Sport;