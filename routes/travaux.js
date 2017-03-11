var express = require('express');
var router = express.Router();
var Travaux = require('../models/travaux');

router.route('/')
    .get(function(req, res, next) {

        var lat = req.query.lat;
        var lon = req.query.lon;
        var rayon = req.query.rayon;

        Travaux.find({}, function(err, travs) {
            var travMap = [];
            var i = 0;
            travs.forEach(function(trav) {
                travMap.push(trav);
            });
            res.status(200).send(travMap);
        });
    });

module.exports = router;
