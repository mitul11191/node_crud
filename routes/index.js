var express = require('express');
var router = express.Router();
var conn = require('../util/connections/connection');

/* GET home page. */
router.get('/ping', function(req, res, next) {
	// conn.query
	console.log("Got a GET Request Fomr home page");
	res.render('index', { title: 'Express Example' });
});
module.exports = router;
