var express = require('express');
var router = express.Router();
var Travaux = require('../models/travaux');

router.route('/')
    .get(function(req, res, next) {

        function toRad(number) { return number * Math.PI / 180; }

        function distance(lat1, lon1, lat2, lon2)
        {
            var tmp  = geolib.getDistanceSimple(
                {latitude: lat1, longitude: lon1},
                {latitude: lat2, longitude: lon2}
            );
            console.log(tmp);
            return tmp;
        }

        var lat = req.query.lat;
        var lon = req.query.lon;
        var rayon_str = req.query.rayon;
        var check = false;
        var rayon = 0;

        if (lat && lon && rayon_str) {
            check = true;
            rayon = parseFloat(rayon_str);
        }

        Travaux.find({}, function(err, travs) {
            var travMap = [];
            var i = 0;
            travs.forEach(function(trav) {
                if (!check || (check && distance(trav.position.lat, trav.position.lon, lat, lon) <= rayon))
                    travMap.push(trav);
            });
            res.status(200).send(travMap);
        });
    });

module.exports = router;
