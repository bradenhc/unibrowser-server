const express = require('express');
const mongo = require('../src/mongo');
const utils = require('./utils');

const sportsRouter = express.Router();

/**
 * Route for getting sports data. This simply retrieves all the free food data from the database and dumps it back
 * to the client
 *
 * If an error occurs, a 500 response will be returned.
 */
sportsRouter.get('/sports', (req, res) => {
    // First we will search the FAQ title (a.k.a. the question being asked)
    mongo.get('sports', {}, { _id: 0 }, (err, result) => {
        if (err) return utils.respondWithError(res);
        if (result.length != 0) {
            return res.status(200).json(result);
        }
        return res.status(404).json({ message: 'Could not find sports information' });
    });
});

module.exports = sportsRouter;