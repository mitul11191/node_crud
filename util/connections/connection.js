var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'node_test'
});

connection.connect(function (err) {
	if (err) {
		console.log(err);
		throw err;
	} else {
		console.log("Connection Successfullly");
	}
});

var secret = 'abch789!@#$12eda#56%^12abxy##@';
var obj = {
	connection: connection,
	secret: secret
}
module.exports = obj;