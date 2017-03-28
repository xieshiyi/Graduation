var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  port     : 3306,  
  user     : 'root',
  password : 'qwer',
  database : 'graduation'  
});

connection.connect();

connection.query('SELECT * from alarm_info', function(err, rows, fields) {
  if (err) throw err;
  console.log('The id is: ', rows[0].id);
});

connection.end();