const express = require('express');
const locationApp = express.Router();
const mongo = require('../mongo');

const REGEX_LAT_LNG = /[0-9]*\.[0-9]*,-?[0-9]*\.[0-9]*/;
const REGEX_TIME = /(\d+):(\d+)/;
const WEEK_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const fetchLatLngs = (docs, res) => {
    const latLngs = [];
    docs.forEach(
        location => {
            const latLng = location['lat_lng'];
            if (REGEX_LAT_LNG.test(latLng)) {
                const temp = latLng.split(',');
                latLngs.push({
                    lat: parseFloat(temp[0]),
                    lng: parseFloat(temp[1])
                });
            }
        },
        () => {
            res.contentType('application/json');
            res.send(latLngs);
        }
    );
};

const busesInfo = (docs, res) => {
    docs.forEach(item => {
        let buses = {};
        if (item) {
            // TODO fix the timezones
            const date = new Date();
            const day_index = date.getDay();
            if (day_index > 0 && day_index < 6) {
                const day = WEEK_DAYS[day_index];
                let busInfo = item['details'][day];
                for (let key in busInfo) {
                    const busTimes = busInfo[key];
                    let busDates = [];
                    for (let i in busTimes) {
                        let busTime = busTimes[i];
                        let busDate = new Date();
                        const time = busTime.match(REGEX_TIME);
                        busDate.setHours(parseInt(time[1]));
                        busDate.setMinutes(parseInt(time[2]));
                        busDates.push(busDate);
                    }
                    busDates.sort();
                    for (let i in busDates) {
                        if (busDates[i] > date) {
                            let mins = '' + busDates[i].getMinutes();
                            if (mins.length < 2) mins = '0' + mins;
                            buses[key] = busDates[i].getHours() + ':' + mins;
                            break;
                        }
                    }
                }
            }
        }
    });
    res.contentType('application/json');
    res.send(buses);
};

locationApp.get('/locations', (req, res) => {
    const latLng = req.query;
    let filter = {};
    if (latLng !== undefined && latLng['lat'] !== undefined && latLng['lng'] !== undefined) {
        filter = { lat_lng: latLng['lat'] + ',' + latLng['lng'] };
    }

    mongo.get('locations', filter, (err, docs) => {
        if (err) return res.status(500).json({ message: 'Failed to get location data' });
        if (latLng !== undefined && latLng['lat'] !== undefined && latLng['lng'] !== undefined) {
            busesInfo(docs, res);
        } else {
            fetchLatLngs(docs, res);
        }
    });
});

module.exports = locationApp;
