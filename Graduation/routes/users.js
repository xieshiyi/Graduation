var express = require('express');
var router = express.Router();
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
 * 添加用户
 */
router.get('/addUser', function (req, res, next) {
  var param = req.query || req.params;
  pool.getConnection(function (err, connection) {
    connection.query('INSERT INTO user_info SET ?', { username: param.username, password: param.password, flag: '0' }, function (err, result) {
      if (result) {
        result = {
          code: 200,
          msg: '增加成功'
        };
      }
      responseJSON(res, result);
      connection.release();
    });
  });
});
/**
 * 查询所有用户
 */
router.get('/', function (req, res, next) {
  var param = req.query || req.params;
  pool.getConnection(function (err, connection) {
    connection.query('SELECT * from user_info WHERE flag != -1 ', function (err, result, fields) {
      responseJSON(res, result);
      connection.release();
    });
  });
});
/**
 * 查询条件用户
 */
router.get('/getUserByParam', function (req, res, next) {
  var param = req.query || req.params;
  pool.getConnection(function (err, connection) {
    connection.query('SELECT * from user_info where ?? = ? ', [param.key, param.value], function (err, result, fields) {
      responseJSON(res, result);
      connection.release();
    });
  });
});
/**
 * 修改用户信息
 */
router.get('/updateUserPassword', function (req, res, next) {
  var param = req.query || req.params;
  pool.getConnection(function (err, connection) {
    connection.query('UPDATE user_info SET password = ? WHERE id = ?', [param.password, param.id], function (err, result, fields) {
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
router.get('/updateUserFlag', function (req, res, next) {
  var param = req.query || req.params;
  pool.getConnection(function (err, connection) {
    connection.query('UPDATE user_info SET flag = 1 WHERE id = ?', [param.id], function (err, result, fields) {
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
 * 删除用户信息
 */
router.get('/deleteUser', function (req, res, next) {
  var param = req.query || req.params;
  pool.getConnection(function (err, connection) {
    connection.query('DELETE FROM user_info WHERE id = ?', [param.id], function (err, result, fields) {
      if (result) {
        result = {
          code: 200,
          msg: '删除成功'
        };
      }
      responseJSON(res, result);
      connection.release();
    });
  });
});
/**
 * 根据条件计算用户数量
 */
router.get('/getAllUserCount', function (req, res, next) {
  var param = req.query || req.params;
  pool.getConnection(function (err, connection) {
    connection.query('SELECT COUNT(flag) AS flagCount FROM user_info WHERE flag != -1 ', [param.flag], function (err, result, fields) {
      responseJSON(res, result);
      connection.release();
    });
  });
});

router.get('/getUserCountByParam', function (req, res, next) {
  var param = req.query || req.params;
  pool.getConnection(function (err, connection) {
    connection.query('SELECT COUNT(flag) AS flagCount FROM user_info WHERE flag=? ', [param.flag], function (err, result, fields) {

      responseJSON(res, result);
      connection.release();
    });
  });
});


module.exports = router;
