//加载mysql模块
const mysql = require("mysql");
const pool = mysql.createPool({
  connectionLimit: 20, //最大连接数
  host: "127.0.0.1",
  port: "3306",
  user: "root",
  password: "", //
  database: "sjcinema", //数据库名
});
//为pool新增一个方法，同步执行sql的方法
pool.querySync = (sql, params) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};
module.exports = pool;
