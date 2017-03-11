var express = require('express');
var router = express.Router();
var Travaux = require('../models/travaux');

router.route('/')
    .get(function(req, res, next) {

        function toRad(number) { return number * Math.PI / 180; }

        function distance(lat1, lon1, lat2, lon2)
        {
            var R = 6371; // Radius of the earth in km
            var dLat = toRad(lat2-lat1);
            var dLon = toRad(lon2-lon1);
            console.log(lat2, " ", lat1, " ", lat2 - lat1);
            var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            console.log("Distance => " + R * c);
            return R * c; // Distance in km
        }

        var lat_str = req.query.lat;
        var lon_str = req.query.lon;
        var rayon_str = req.query.rayon;
        var check = false;
        var lat = 0, lon = 0, rayon = 0;

        if (lat_str && lon_str && rayon_str) {
            check = true;
            lat = parseFloat(lat_str);
            lon = parseFloat(lon_str);
            rayon = parseFloat(rayon_str);
            console.log("Has args => : " + lat + " " + lon + " " + rayon);
        }

        Travaux.find({}, function(err, travs) {
            var travMap = [];
            var i = 0;
            travs.forEach(function(trav) {
                if (!check || (check && distance(parseFloat(trav.position.lat), parseFloat(trav.position.lon), lat, lon) <= rayon))
                    travMap.push(trav);
            });
            res.status(200).send(travMap);
        });
    });

module.exports = router;
