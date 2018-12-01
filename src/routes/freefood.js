const express = require('express');
const mongo = require('../src/mongo');
const utils = require('./utils');

const freeFoodRouter = express.Router();

/**
 * Route for getting free food data. This simply retrieves all the free food data from the database and dumps it back
 * to the client
 *
 * If an error occurs, a 500 response will be returned.
 */
freeFoodRouter.get('/freefood', (req, res) => {
    let sortCriteria = { event_date: 1 };
    // First we will search the FAQ title (a.k.a. the question being asked)
    mongo.get('freefood', {}, { _id: 0 }, sortCriteria, (err, result) => {
        if (err) return utils.respondWithError(res);
        if (result.length != 0) {
            return res.status(200).json(result);
        }
        return res.status(404).json({ message: 'Could not find free food information' });
    });
});

module.exports = freeFoodRouter;