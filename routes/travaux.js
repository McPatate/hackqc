var express = require('express');
var router = express.Router();
var geolib = require('geolib');
var Travaux = require('../models/travaux');

router.route('/')
    .get(function(req, res, next) {

        function toRad(number) { return number * Math.PI / 180; }

        function distance(lat1, lon1, lat2, lon2)
        {
            console.log(lat1, lon1, lat2, lon2);
            var tmp  = geolib.getDistanceSimple(
                {latitude: lat1, longitude: lon1},
                {latitude: lat2, longitude: lon2}
            );
            console.log(tmp);
            return tmp;
        }

        var lat_str = req.query.lat;
        var lon_str = req.query.lon;
        var rayon_str = req.query.rayon;
        var check = false;
        var lat = 0.0, lon = 0.0, rayon = 0.0;

        if (lat_str && lon_str && rayon_str) {
            check = true;
            rayon = parseFloat(rayon_str);
            lat = parseFloat(lat_str);
            lon = parseFloat(lon_str);
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
