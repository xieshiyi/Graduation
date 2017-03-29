var express = require('express');
var router = express.Router();
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  port     : 3306,  
  user     : 'root',
  password : 'qwer',
  database : 'graduation'  
});
var info;
connection.connect();
connection.query('SELECT * from alarm_info', function(err, rows, fields) {
  if (err) throw err;
  info=rows
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json(info);
});
connection.end();
module.exports = router;
