const express = require('express');
const mongo = require('../src/mongo');
const utils = require('./utils');

const profRouter = express.Router();

/**
 * Route for getting professor data. Since the query is generic, we will first search (using regular expressions)
 * the names of professors in the DB. Following that will be the research interests and then the contact information.
 * When a match is found, the result will be returned to the client. If not, 404 will be returned. If an error occurs,
 * a 500 response will be returned.
 */
profRouter.get('/professors', (req, res) => {
    const query = req.query.query || '';
    let sortCriteria = { name: 1 };
    // First we will search the name field for the query
    mongo.get('professor', { name: { $regex: query } }, { _id: 0 }, (err, result) => {
        if (err) return utils.respondWithError(res);
        if (result.length != 0) {
            return res.status(200).json(result);
        }
        // We didn't find what we were looking for with the name. Now let's try to look in research interests.
        mongo.get('professor', { research: { $regex: query } }, { _id: 0 }, sortCriteria, (err, result) => {
            if (err) return utils.respondWithError(res);
            if (result.length != 0) {
                return res.status(200).json(result);
            }
            // Again, didn't find what we were looking for. Check the contact info
            mongo.get('professor', { contact: { $regex: query } }, { _id: 0 }, sortCriteria, (err, result) => {
                if (err) return utils.respondWithError(res);
                if (result.length != 0) {
                    return res.status(200).json(result);
                }
                // Couldn't find anything. Respond with NOT FOUND
                res.status(404).json({ message: 'Could not find professor info with given search query' });
            });
        });
    });
});

module.exports = profRouter;
