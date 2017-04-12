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
 *数据监听，超过或者低于，发送邮箱进行报警
 */
const nodemailer = require('nodemailer');
const fs = require('fs')
const argv = require('optimist').argv;

const logfile = '/root/docker-reg-gc/log/' + argv._[0] + '.log';

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  service: 'QQex',
  auth: {
    user: 'you@email',
    pass: 'youpassword'
  }
});

// setup email data with unicode symbols
let mailOptions = {
  from: 'sendfrom@email', // sender address
  to: ['to@email1', 'to@email2'], // list of receivers
  subject: 'ERROR: docker registry crontab error', // Subject line
  text: fs.readFileSync(logfile) // plain text body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log(error);
  }
  console.log('Message %s sent: %s', info.messageId, info.response);
});
/**
 * 插入数据
 */
router.get('/insert', function (req, res, next) {
  let count = 10;
  while (count--) {
    for (let i = 1; i < 5; i++) {
      let h = Math.random() * 10;
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


router.get('/repo/select', function (req, res, next) {
  var param = req.query || req.params;
  return influx.query(` 
  select * from monitor where number = '${param.repo}' and time >= now() - ${param.hours}h
  `).then(rows => res.json(rows));
});

http.listen(8080, function () {
  console.log('socket.io listening on *:8080');
});
module.exports = router;
