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
var infoAll,infoSelect;
connection.connect();
connection.query('SELECT * from warehouse_info', function(err, rows, fields) {
  if (err) throw err;
  infoAll=rows
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json(infoAll);
});
connection.end();
module.exports = router;
