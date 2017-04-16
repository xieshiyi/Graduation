var express = require('express');
var router = express.Router();
var dateFormat = require('dateFormat');
/**
 * 导入MYSQL模块
 */
var mysql = require('mysql');
var pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: 'qwer',
  database: 'graduation'
});

// 响应一个JSON数据
var responseJSON = function (res, ret) {
  if (typeof ret === 'undefined') {
    res.json({
      code: '-200', msg: '操作失败'
    });
  } else {
    res.json(ret);
  }
};

/**
 * 查询邮箱账号
 */
router.get('/info', function (req, res, next) {
  var param = req.query || req.params;
  pool.getConnection(function (err, connection) {
    connection.query('SELECT * from alarm_info ', function (err, result, fields) {
      responseJSON(res, result);
      connection.release();
    });
  });
});
/**
 * 修改邮箱账号
 */
router.get('/updateEmail', function (req, res, next) {
  var param = req.query || req.params;
  pool.getConnection(function (err, connection) {
    connection.query('UPDATE alarm_info SET email = ?', [param.email], function (err, result, fields) {
      if (result) {
        result = {
          code: 200,
          msg: '修改成功'
        };
      }
      responseJSON(res, result);
      connection.release();
    });
  });
});
/**
 * 插入报警数据
 */
router.get('/insertWarning', function (req, res, next) {
  var param = req.query || req.params;
  var time = dateFormat(param.time, 'yyyy-mm-dd HH:MM:ss');
  pool.getConnection(function (err, connection) {
    connection.query('INSERT INTO warning SET ?', { repo: param.repo, time: time, height: param.height }, function (err, result, fields) {
      if (result) {
        result = {
          code: 200,
          msg: '插入成功'
        };
      }
      responseJSON(res, result);
      connection.release();
    });
  });
});

/**
 * 查询报警数据
 */                                 
router.get('/getAlarmByParam', function (req, res, next) {
  var param = req.query || req.params;
  pool.getConnection(function (err, connection) {
    connection.query('SELECT * FROM warning WHERE repo = ? and time >= now()-INTERVAL ? MINUTE', [param.repo, param.minutes], function (err, result, fields) {
      responseJSON(res, result);
      connection.release();
    });
  });
});

module.exports = router;
