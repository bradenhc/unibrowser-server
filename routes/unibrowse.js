
(function(){
"use strict";
var express = require('express'),
    // Instantiating express module
    unibrowseRouter = express.Router(),
    path = require('path'),
    _ = require('underscore.deferred'),
    fs = require('fs'),
    ip = require("ip"),
    request = require("request"),
    distance = require('euclidean-distance'),
    mongoose = require('mongoose'),
    logger = require('js-logger'),
    less = require('less-middleware'),
    db,
    mongodb = require('mongodb'),
    MongoClient = mongodb.MongoClient;

    var data = fs.readFileSync('./config.json', 'utf8');
    var config = JSON.parse(data);

    var url = "mongodb://" +
        config.dbUrl + ":" +
        config.dbPort;

    MongoClient.connect(url, function (err, database) {
        if (err) {
        throw err;
        }
        else {
            db = database.db(config.dbName);
            console.log("connected to DB");
        }
    });

  function getIP() {
    var dfd = _.Deferred();
    var ipAddress = "0.0.0.0";  // default public ipv4 address
    request.get("https://api.ipify.org?format=json", function (error, response, body){
      if(!error){
        let data = JSON.parse(response.body);
        ipAddress = data.ip;
        dfd.resolve(ipAddress);
      }
      else{
        dfd.reject();
      }
    });
    console.log("IP dfd: ", dfd);
    return dfd;
  }

  function getLocation(ipAddress){

    var dfd = _.Deferred();
    console.log("My IP Address: ", ipAddress);
    var location = {latitude: "0",
                    longitude: "0"};
    var url = 'http://api.ipstack.com/' + ipAddress + '?access_key=fabe18ddb7e247214d52d929c31fd54d';
    request.get(url, function (error, response, body){
      if (!error){
        var data = JSON.parse(body);
        console.log("I made it!");
        location.latitude = data.latitude;
        location.longitude = data.longitude;
        console.log("Location: ", location);
        dfd.resolve(location);
      }
      else{
        dfd.reject();
      }
    });
    console.log("Location dfd: ", dfd);
    return dfd;
  }

  function calculateNearest(long, lat, coordinateList){
    var myLocation = getLocation();
    lat = myLocation.latitude;
    long = myLocation.longitude;
    console.log("Yaay I'm here!");
    var nearest = {};
    var pos = 0;
    var min = distance([lat, long],[coordinateList[0].lat, coordinateList[0].lat]);
    for (var i in coordinateList){
      var myDist = distance([lat, long],[coordinateList[i].lat, coordinateList[i].lat]);
      if(myDist < min){
        min = myDist;
        pos = i;
      }
    }
    return coordinateList[pos];
  }

unibrowseRouter.get("/professors", function(req,res){
    /*
    * storing the user passed string in a variable
    */

    var queryString = req.query['query'];

    /*
    * define the criteria to sort the results.
    */
    var mysort = { name: 1 };
    queryString = "name=John";
    /*
    * Excluding the ID field while displaying results.
    */
    db.collection('professor').find({"name": {$regex:queryString}}, { _id: 0 }).sort(mysort).toArray(function(err,result){
        if(err) throw err;

        /*
        * If the string searched is a professor name, result will return an array.
        * check array contains information.
        */
        if (result.length!=0){
            console.log("Found name.");
            // console.log(result);
            res.send(result);

        }

        /*
        * If the string searched is not a professor name or no matching results in the name field, result will be null.
        */
        else{
            console.log("Could not find name.");

            /*
            * check if the string is a research area of a professor
            */
            db.collection('professor').find({"research": {$regex:queryString}}, { _id: 0 }).sort(mysort).toArray(function(err,result){
                if(err) throw err;

                /*
                * if the string looked for is a research area of a professor, return all the professors with the given research interest.
                */
                if (result.length!=0){
                    console.log("Found professors with similar research.");
                    res.send(result);

                }

                else{
                    console.log("Could not find professors with similar research.");

                    /*
                    * check if the string is contact information for a professor
                    */
                    db.collection('professor').find({"contact": {$regex:queryString}}, { _id: 0 }).sort(mysort).toArray(function(err,result){
                        if(err) throw err;

                        if (result.length!=0){
                            console.log("found professors.");
                            res.send(result);

                        }

                        else{
                            console.log("Could not find professors.");
                            res.send(404)
                        }
                    });
                }
            });
        }
    });
});

unibrowseRouter.get("/faqs", function(req,res){

  // data['link'] = link
  // data['tags'] = tagsList[i]
  // data['title'] = question
  // data['a'] = answer

    /*
    * storing the user passed string in a variable
    */
    var queryString = req.query["query"];

    /*
    * define the criteria to sort the results.
    */
    var mysort = { name: 1 };

    /*
    * Excluding the ID field while displaying results.
    */
    db.collection('faqs').find({"title": {$regex:queryString}}, { _id: 0 }).sort(mysort).toArray(function(err,result){

        if(err) throw err;

        /*
        * If the string searched is a professor name, result will return an array.
        * check array contains information.
        */
        if (result.length!=0){
            console.log("Found question.");
            // console.log(result);
            res.send(result);

        }

        /*
        * If the string searched is not a professor name or no matching results in the name field, result will be null.
        */
        else{
            console.log("Could not find question.");

            /*
            * check if the string is a research area of a professor
            */
            var words = queryString.split(" ");

            db.collection('faqs').find({"tags": {$in : words}}, { _id: 0 }).sort(mysort).toArray(function(err,result){
                if(err) throw err;

                /*
                * if the string looked for is a research area of a professor, return all the professors with the given research interest.
                */
                if (result.length!=0){
                    console.log("Found questions with similar attributes.");
                    res.send(result);

                }

                else{
                    console.log("Could not find similar questions.");

                    /*
                    * check if the string is contact information for a professor
                    */

                    db.collection('faqs').find({"a": {$regex:queryString}}, { _id: 0 }).sort(mysort).toArray(function(err,result){
                        if(err) throw err;

                        if (result.length!=0){
                            console.log("Answers matching your search.");
                            res.send(result);

                        }

                        else{
                            console.log("Could not find any related question/answer to your query.");
                            res.send(404)
                        }
                    });
                }
            });
        }
    });
});

/***
	route to fetch free food information
***/
unibrowseRouter.get("/freefood", function(req,res){

    console.log("Heya! I am in free food module.");
    /*
    * define the criteria to sort the results.
    */
    var mysort = { event_date: 1 };

    /*
    * Excluding the ID field while displaying results.
    */
    db.collection('freefood').find().sort(mysort).toArray(function(err,result){
    if(err) throw err;

        /*
        * If the searched string is found, the result is returned. Else, an error page is displayed.
        * check array contains information.
        */
        if (result.length!=0){
            console.log("Found a matching result.");
            res.send(result);

        }
        else{
            console.log("Could not find a matching result.");
            res.send(404)
        }
    });

    var location  = "";

    _.when(getIP())
      .done(function(ipAddress) {
          _.when(getLocation(ipAddress))
            .done(function(data) {
              location = data;
              console.log("Completed loop.");
              // dfd.resolve();
            })
            .fail(function() {
              console.log("Failed to load location.");
            });
          })
      .fail(function() {
          console.log("Failed to load IP.");
    });

});

unibrowseRouter.get("/events", function(req,res){
    var queryString = req.query['query'];

    db.collection('events').find().toArray(function(err,result){
    if(err) throw err;
        /*
        * If the searched string is found, the result is returned. Else, an error page is displayed.
        * check array contains information.
        */
        if (result.length!=0){
            console.log("Found a matching result.");
            res.send(result);

        }
        else{
            console.log("Could not find a matching result.");
            res.send(404)
        }
    });

    var location  = "";

    _.when(getIP())
      .done(function(ipAddress) {
          _.when(getLocation(ipAddress))
            .done(function(data) {
              location = data;
              console.log("Completed loop.");
              // dfd.resolve();
            })
            .fail(function() {
              console.log("Failed to load location.");
            });
          })
      .fail(function() {
          console.log("Failed to load IP.");
    });

});

unibrowseRouter.get("/sports", function(req,res){
    var queryString = req.query['query'];

    db.collection('sports').find().toArray(function(err,result){
    if(err) throw err;
        /*
        * If the searched string is found, the result is returned. Else, an error page is displayed.
        * check array contains information.
        */
        if (result.length!=0){
            console.log("Found a matching result.");
            res.send(result);

        }
        else{
            console.log("Could not find a matching result.");
            res.send(404)
        }
    });

    var location  = "";

    _.when(getIP())
      .done(function(ipAddress) {
          _.when(getLocation(ipAddress))
            .done(function(data) {
              location = data;
              console.log("Completed loop.");
              // dfd.resolve();
            })
            .fail(function() {
              console.log("Failed to load location.");
            });
          })
      .fail(function() {
          console.log("Failed to load IP.");
    });

});

  module.exports = unibrowseRouter;

}());
