var express = require('express');
var router = express.Router();

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// app.get('/test', function(req, res){
// 	res.send('<h1>Welcome Realtime Server</h1>');
// });


// io.on('connection', function (socket) {
//   console.log('a user connected');
//   // io.emit('monitor', '');
//   // socket.on('monitor', function (msg) {
//   //   console.log('server-msg:' + msg);
//   // });
// });



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
/**
 * 插入数据
 */
router.get('/insert', function (req, res, next) {
  for (let i = 1; i < 5; i++) {
    let h = Math.random();
    influx.writePoints([
      {
        measurement: 'monitor',
        tags: { number: i },
        fields: { height: h },
      }
    ]).then(() =>  {
        io.emit('monitor', {'number': i,'height':h});     
     res.send(200);
    }); 
  }
});
/* GET users listing. */
/**
 * 对仓库1的监听
 */
router.get('/num1', function (req, res, next) {
    return influx.query(`
    select * from monitor where number='1' order by time desc limit 1
  `).then(rows => res.json(rows));
});
/**
 * 对仓库2的监听
 */
router.get('/num2', function (req, res, next) {
  influx.writePoints([
    {
      measurement: 'monitor',
      tags: { number: 2 },
      fields: { height: Math.random() },
    }
  ]).then(() => {
    return influx.query(`
    select * from monitor where number='2'
  `)
  }).then(rows => res.json(rows))
});
/**
 * 对仓库3的监听
 */
router.get('/num3', function (req, res, next) {
  influx.writePoints([
    {
      measurement: 'monitor',
      tags: { number: 3 },
      fields: { height: Math.random() },
    }
  ]).then(() => {
    return influx.query(`
    select * from monitor where number='3'
  `)
  }).then(rows => res.json(rows))
});
/**
 * 对仓库4的监听
 */
router.get('/num4', function (req, res, next) {
  influx.writePoints([
    {
      measurement: 'monitor',
      tags: { number: 4 },
      fields: { height: Math.random() },
    }
  ]).then(() => {
    return influx.query(`
    select * from monitor where number='4'
  `)
  }).then(rows => res.json(rows))
});

http.listen(8080, function () {
  console.log('listening on *:8080');
});
module.exports = router;