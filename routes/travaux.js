var express = require('express');
var router = express.Router();
var Travaux = require('../models/travaux');

router.route('/')
    .get(function(req, res, next) {

        function toRad(number) { return number * Math.PI / 180; }

        function distance(lat1, long1, lat2, lon2)
        {
            var R = 6371; // Radius of the earth in km
            var dLat = toRad(lat2-lat1);
            var dLon = toRad(lon2-lon1);
            var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            console.log("Distance => " + R * c);
            return R * c; // Distance in km
        }

        var lat = req.query.lat;
        var lon = req.query.lon;
        var rayon = req.query.rayon;
        var check = false;

        console.log(lat, lon, rayon);
        if (lat && lon && rayon)
            check = true;

        Travaux.find({}, function(err, travs) {
            var travMap = [];
            var i = 0;
            travs.forEach(function(trav) {
                if (!check || (check && distance(trav.lat, trav.lon, lat, lon) <= rayon))
                    travMap.push(trav);
            });
            res.status(200).send(travMap);
        });
    });

module.exports = router;
