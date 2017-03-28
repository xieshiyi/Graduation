var express = require('express');
var router = express.Router();
const Influx = require('influx');

const influx = new Influx.InfluxDB({
 host: 'localhost',
 database: 'graduation',
 schema: [
   {
     measurement: 'monitor',
     fields: {
       height: Influx.FieldType.FLOAT
     },
     tags: [
       'number'
     ]
   }
 ]
})
/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send(influx.data);
  influx.query(`
    select * from monitor 
  `).then(rows =>res.json(rows))
});

module.exports = router;
