// Require a Schema
const mongoose = require('mongoose');

// Define a Schema
const Schema = mongoose.Schema;

// Create Schema for Professor
var ProfessorSchema = new Schema({
    name : String,
    research : String,
    contact : String
});

// Compile model from Schema
var Professor = mongoose.model('Professor', ProfessorSchema);

module.exports = Professor;