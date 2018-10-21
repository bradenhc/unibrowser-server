// Require a Schema
const mongoose = require('mongoose');

// Define a Schema
const Schema = mongoose.Schema;

// Create Schema for Professor
var EventSchema = new Schema({
    Heading : String,
    Content : String,
    URL : String,
    Tags : Array,
    Rank : Number
});

// Compile model from Schema
var Event = mongoose.model('Event',EventSchema);

module.exports = Event;