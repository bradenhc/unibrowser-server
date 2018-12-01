const express = require('express');
const mongo = require('../src/mongo');
const _ = require('underscore.deferred');
const request = require('request');
const utils = require('./utils');

const eventsRouter = express.Router();

// The following are helper functions for event information. They help us narrow the search results for events based
// upon the IP address of the client requesting the information

/**
 * Retrieves the IP address of the client. Currently (since we only run this locally) we are assuming that the server
 * is in the same location as the user. Ultimately we would want to get the IP from the actually HTTP request itself.
 */
function getIP() {
    var dfd = _.Deferred();
    var ipAddress = '0.0.0.0'; // default public ipv4 address
    request.get('https://api.ipify.org?format=json', function(error, response, body) {
        if (!error) {
            let data = JSON.parse(response.body);
            ipAddress = data.ip;
            dfd.resolve(ipAddress);
        } else {
            dfd.reject();
        }
    });
    return dfd;
}

/**
 * Retrieves the location based upon the IP address of the client.
 * @param {string} ipAddress the IP address of the client
 */
function getLocation(ipAddress) {
    var dfd = _.Deferred();
    console.log('My IP Address: ', ipAddress);
    var location = {
        latitude: '0',
        longitude: '0'
    };
    var url = 'http://api.ipstack.com/' + ipAddress + '?access_key=fabe18ddb7e247214d52d929c31fd54d';
    request.get(url, function(error, response, body) {
        if (!error) {
            var data = JSON.parse(body);
            location.latitude = data.latitude;
            location.longitude = data.longitude;
            dfd.resolve(location);
        } else {
            dfd.reject();
        }
    });
    return dfd;
}

/**
 * Finds the nearest event based on the latitude and longitude of the client.
 *
 * @param {number} long the longitude of the client
 * @param {number} lat the latitude of the client
 * @param {array} coordinateList a list of event coordinates
 */
function calculateNearest(long, lat, coordinateList) {
    var pos = 0;
    var min = distance([lat, long], [coordinateList[1].latitude, coordinateList[1].longitude]);
    for (var i in coordinateList) {
        var myDist = distance([lat, long], [coordinateList[i].latitude, coordinateList[i].longitude]);
        if (myDist < min) {
            min = myDist;
            pos = i;
        }
    }
    return coordinateList[pos];
}

/**
 * Route for getting event data. This simply retrieves all the free food data from the database and dumps it back
 * to the client. We try to intelligently sort it based on the location of the requestor (hence the above helper
 * functions).
 *
 * If an error occurs, a 500 response will be returned.
 */
eventsRouter.get('/events', (req, res) => {
    // First we will search the FAQ title (a.k.a. the question being asked)
    mongo.get('events', {}, { _id: 0 }, (err, result) => {
        if (err) return utils.respondWithError(res);
        if (result.length != 0) {
            let location = '';
            let events = [];

            for (let e of result) {
                let obj = { longitude: e.geo_long, latitude: e.geo_lat };
                events.push(obj);
            }

            _.when(getIP())
                .done(address => {
                    _.when(getLocation(address))
                        .done(data => {
                            location = data;
                            let nearest = calculateNearest(location.longitude, location.latitude, events);
                            console.log('My nearest event is', nearest);
                        })
                        .fail(() => {
                            console.log('Failed ot load IP');
                        });
                })
                .fail(() => {
                    console.log('Failed to load IP');
                });

            return res.status(200).json(result);
        }
        return res.status(404).json({ message: 'Could not find event information' });
    });
});

module.exports = eventsRouter;
