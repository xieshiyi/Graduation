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
    let h = Math.random()*10;
    influx.writePoints([
      {
        measurement: 'monitor',
        tags: { number: i },
        fields: { height: h },
      }
    ]).then(() => {
      io.emit('monitor', { 'number': i, 'height': h });
      res.send(200);
    });
  }
});
/* GET users listing. */
/**
 * 对仓库的监听
 */
router.get('/repo', function (req, res, next) {
  var param = req.query || req.params;
  return influx.query(` 
  select * from monitor where number = '${param.repo}' order by time desc limit ${parseInt(param.number)}
  `).then(rows => res.json(rows));
});

http.listen(8080, function () {
  console.log('socket.io listening on *:8080');
});
module.exports = router;
