var express = require('express');
var router = express.Router();
var Bacs = require('../models/bacs');

router.route('/')
    .get(function(req, res, next) {
        Bacs.find({}, function (err, bacs) {
            var bacMap = [];
            var i = 0;
            bacs.forEach(function(bac) {
                bacMap.push(bac);
            });
            res.status(200).send(bacMap);
        });
    })
    .post(function(req, res, next) {
        var bac = new Bacs(req.body);
        bac.save(function (err) {
            if (err) {
                res.status(500).send('not ok');
                return console.error(err);
            }
            res.status(200).send('ok');
        });
    })
    .put(function(req, res, next) {
        Bacs.findOneAndUpdate({ name : req.body.name }, req.body, {upsert : true}, function (err) {
            if (err) {
                res.status(500).send('not ok');
                return console.error(err);
            }
            res.status(200).send('ok');
        });
    })
    .delete(function(req, res, next) {
        Bacs.findOneAndRemove({ name : req.body.name }, function (err) {
            if (err) return res.status(500).send('not ok');
            res.status(200).send('ok');
        });
    });

module.exports = router;
