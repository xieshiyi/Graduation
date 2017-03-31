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
/**
 * 对仓库1的监听
 */
router.get('/num1', function(req, res, next) {
  influx.writePoints([
  {
    measurement: 'monitor',
    tags: { number: 1  },
    fields: { height:Math.random() },
  }
]).then(() => {
  return influx.query(`
    select * from monitor where number='1'
  `)
}).then(rows =>res.json(rows))
 });
 /**
  * 对仓库2的监听
  */
router.get('/num2', function(req, res, next) {
  influx.writePoints([
  {
    measurement: 'monitor',
    tags: { number: 2  },
    fields: { height:Math.random() },
  }
]).then(() => {
  return influx.query(`
    select * from monitor where number='2'
  `)
}).then(rows =>res.json(rows))
 });
 /**
  * 对仓库3的监听
  */
router.get('/num3', function(req, res, next) {
  influx.writePoints([
  {
    measurement: 'monitor',
    tags: { number: 3  },
    fields: { height:Math.random() },
  }
]).then(() => {
  return influx.query(`
    select * from monitor where number='3'
  `)
}).then(rows =>res.json(rows))
 });
 /**
  * 对仓库4的监听
  */
router.get('/num4', function(req, res, next) {
  influx.writePoints([
  {
    measurement: 'monitor',
    tags: { number: 4  },
    fields: { height:Math.random() },
  }
]).then(() => {
  return influx.query(`
    select * from monitor where number='4'
  `)
}).then(rows =>res.json(rows))
 });
module.exports = router;
