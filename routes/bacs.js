var express = require('express');
var router = express.Router();

router.route('/')
    .get(function(req, res, next) {
        
    })
    .post(function(req, res, next) {
        console.log(req.body.ok.salut);
        res.send('ok');
    })
    .put(function(req, res, next) {

    })
    .delete(function(req, res, next) {
        res.send('ok');
    });

module.exports = router;
