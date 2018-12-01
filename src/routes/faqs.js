const express = require('express');
const mongo = require('../src/mongo');
const utils = require('./utils');

const faqRouter = express.Router();

/**
 * Route for getting FAQ data. Since the query is generic, we will first search (using regular expressions)
 * the title (or the question) in the DB. Next is the tags, then the answer to the question.
 *
 * When a match is found, the result will be returned to the client. If not, 404 will be returned. If an error occurs,
 * a 500 response will be returned.
 */
faqRouter.get('/faqs', (req, res) => {
    const query = req.query.query || '';
    let sortCriteria = { title: 1 };
    // First we will search the FAQ title (a.k.a. the question being asked)
    mongo.get('faqs', { title: { $regex: query } }, { _id: 0 }, sortCriteria, (err, result) => {
        if (err) return utils.respondWithError(res);
        if (result.length != 0) {
            return res.status(200).json(result);
        }
        // We didn't find what we were looking for with the title. Now let's try to looking in the tags.
        let words = query.split(' ');
        mongo.get('faqs', { tags: { $in: words } }, { _id: 0 }, sortCriteria, (err, result) => {
            if (err) return utils.respondWithError(res);
            if (result.length != 0) {
                return res.status(200).json(result);
            }
            // Again, didn't find what we were looking for. Check the answers
            mongo.get('faqs', { a: { $regex: query } }, { _id: 0 }, sortCriteria, (err, result) => {
                if (err) return utils.respondWithError(res);
                if (result.length != 0) {
                    return res.status(200).json(result);
                }
                // Couldn't find anything. Respond with NOT FOUND
                res.status(404).json({
                    message: 'Could not find FAQ info with given search query'
                });
            });
        });
    });
});

module.exports = faqRouter;
