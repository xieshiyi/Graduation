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
* 查询所有仓库
*/
router.get('/', function (req, res, next) {
  var param = req.query || req.params;
  pool.getConnection(function (err, connection) {
    connection.query('SELECT * from warehouse_info', function (err, result, fields) {
      responseJSON(res, result);
      connection.release();
    });
  });
});
/**
 * 查询条件仓库
 */
router.get('/getWarehouseByParam', function (req, res, next) {
  var param = req.query || req.params;
  pool.getConnection(function (err, connection) {
    connection.query('SELECT * from warehouse_info where repo = ? ', [param.repo], function (err, result, fields) {
      responseJSON(res, result);
      connection.release();
    });
  });
});
/**
 * 修改仓库信息
 */
router.get('/updateWarehouse', function (req, res, next) {
  var param = req.query || req.params;
  pool.getConnection(function (err, connection) {
    connection.query('UPDATE warehouse_info SET height = ? , d = ? , limit_upper = ? , limit_lower = ?  WHERE repo = ?', [param.height, param.d, param.upperLimit, param.lowerLimit, param.repo], function (err, result, fields) {
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
module.exports = router;
