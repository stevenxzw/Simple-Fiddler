var express = require('express');
var router = express.Router()
var config = require('./../config/base.js').config;
var _ = require('underscore');

/* GET home page. */
router.get('/', function(req, res) {
    var rules = global.currentRule;
    res.render('index', { title: config.project, projectName : config.project, content: JSON.stringify({rules:rules}) ,action:'/'});
})
module.exports = router;
