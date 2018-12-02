const express = require('express');
const mongo = require('../mongo');
const utils = require('./utils');

const sportsRouter = express.Router();
var keywordMap = { next: "value1", key2: "value2" }
 
/**
 * Route for getting sports data. This simply retrieves all the free food data from the database and dumps it back
 * to the client
 *
 * If an error occurs, a 500 response will be returned.
 */
function getSportFromQuery(query, sports, sportsIds) {
    for(i = 0; i < sports.length; i++) {
        sport = sports[i]
        if (query.toLowerCase().indexOf(sport.split(" ")[0].toLowerCase()) !== -1) {
            return sportsIds[i]
        }
        
    } 
    return -1
}

sportsRouter.get('/sports', (req, res) => {
    var queryString = req.query['query'];
    console.log("Heya! I am in sport module. : " + queryString);  

    
    if (isNaN(queryString)) {
        // console.log('This is not number');
        // var chrono = require('chrono-node');
        // mongo.get('school_sports', {}, { _id: 0 }, (err, result) => {
        //     if (err) return utils.respondWithError(res);
        //     if (result.length != 0) {
        //         sportsNameList = result[0]["sports_name_list"]
        //         sportsIdList = result[0]["sports_id_list"]

        //         console.log(chrono.parseDate(queryString));
        //         dateQuery = chrono.parseDate(queryString)
        //         sportId = getSportFromQuery(queryString, sportsNameList, sportsIdList)
        //         console.log("SportId : " + sportId)
        //         if (sportId == -1) {
        //             sportQuery = {"date" : new Date(dateQuery)}
        //         } else {
        //             sportQuery = {"sport_id" : sportId, "date" : Date(dateQuery)}
        //         }
        //         console.log(sportQuery)
        //         mongo.get('sportsevent', sportQuery, { _id: 0 }, (err, result) => {
        //             if (err) return utils.respondWithError(res);
        //             if (result.length != 0) {
        //                 return res.status(200).json(result);
        //             }
        //             return res.status(404).json({ message: 'Could not find sports information' });
        //         });
        //     }
        //     return res.status(404).json({ message: 'Could not find sports information' });
        // });
    } else {
        if(queryString == "-1") {
            //Return school sports
            console.log("Heya! I am in sport school module. : -1");  
    
            mongo.get('school_sports', {}, { _id: 0 }, (err, result) => {
                if (err) return utils.respondWithError(res);
                if (result.length != 0) {
                    return res.status(200).json(result);
                }
                return res.status(404).json({ message: 'Could not find sports information' });
            });
        } else {
            mongo.get('sportsevent', {"sport_id": parseInt(queryString)}, { _id: 0 }, (err, result) => {
                if (err) return utils.respondWithError(res);
                if (result.length != 0) {
                    return res.status(200).json(result);
                }
                return res.status(404).json({ message: 'Could not find sports information' });
            });
        }
    }

});

module.exports = sportsRouter;