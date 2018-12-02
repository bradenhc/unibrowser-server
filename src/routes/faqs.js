const express = require('express');
const mongo = require('../mongo');
const utils = require('./utils');
const WordPOS = require('wordpos');
const Lemmer = require('lemmer');
wordpos = new WordPOS();
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
    wordpos.getNouns('a person Abhi Bachchan who is deemed to be despicable or contemptible; "only a rotter would do that"; "kill the rat"; "throw the bum out"; "you cowardly little pukes!"; "the British call a contemptible person a `git." The angry bear chased the frightened little squirrel.', function(result){
        console.log(result);
        Lemmer.lemmatize(result, function(err, lemmatize_result){
            console.log(lemmatize_result);  
            for(var i=0; i<lemmatize_result.length; i++){
                var selected_slots = lodash.filter(slotname, x => x.lemma_name === 'cat');
                console.log(selected_slots)
            }
        })
    });
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
