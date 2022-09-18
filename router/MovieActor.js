/**
 * 定义电影演员相关接口
 */
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const Response = require("../utils/Response.js");

//引入mysql连接池
const pool = require("../utils/pool.js");

/**
 * 通过关键字查询演员接口
 */
router.post("/movie-actors/name", (req, resp) => {
  let { name } = req.body;
  let schema = Joi.object({
    name: Joi.string().required(), //必填
  });
  let { error, value } = schema.validate(req.body);
  if (error) {
    resp.send(Response.error(400, error));
    return;
  }

  let sql = "select * from movie_actor where actor_name like ?";
  pool.query(sql, [`%${name}%`], (err, result) => {
    if (err) {
      resp.send(Response.error(500, err));
      throw err;
    }
    resp.send(Response.ok(result));
  });
});

/**
 * 删除演员接口
 */
router.post("/movie-actor/del", (req, resp) => {
  let { id } = req.body;
  //表单验证
  let schema = Joi.object({
    id: Joi.string().required(), //必填
  });
  let { error, value } = schema.validate(req.body);
  if (error) {
    resp.send(Response.error(400, error));
    return;
  }

  let sql = "delete from movie_actor where id = ?";
  pool.query(sql, [id], (error, result) => {
    if (error) {
      resp.send(Response.error(500, error));
      throw error;
    }
    resp.send(Response.ok());
  });
});

/**
 * 添加演员接口
 * @params:
 *      actorName:演员名字
 *      actorAvatar:演员头像路径
 *
 */
router.post("/movie-actor/add", (req, resp) => {
  let { actorName, actorAvatar } = req.body; //post请求参数在req.body中
  console.log(actorName, actorAvatar);

  //表单验证
  let schema = Joi.object({
    actorName: Joi.string().required(), //必填
    actorAvatar: Joi.string().required(), //必填
  });
  let { error, value } = schema.validate(req.body);
  if (error) {
    resp.send(Response.error(400, error));
    return; //结束
  }
  //表单验证通过，执行添加操作
  let sql = "insert into movie_actor (actor_name,actor_avatar) values (?,?)";
  pool.query(sql, [actorName, actorAvatar], (error, result) => {
    if (error) {
      resp.send(Response.error(500, error));
      throw error;
    }
    resp.send(Response.ok());
  });
});

/**
 * 查询所有演员接口
 * @param:
 *   page:1 //当前页码
 *   pagesize:10  ///每页条数
 * http://127.0.0.1:3000/movie-actors?page=1&pagesize=10
 */
const jwt = require("jsonwebtoken");
router.get("/movie-actors", (req, resp) => {
  //获取请求参数， get请求的参数在req,query中
  let { page, pagesize } = req.query;

  //服务端表单验证，如果验证通过，九继续后续业务，如果验证不通过，则直接返回参数异常
  let schema = Joi.object({
    page: Joi.number().required(), //page必须是数字，必填
    pagesize: Joi.number().integer().required(), //pagesize必须是不大于100的数字，必填
  });
  let { error, value } = schema.validate(req.query);
  if (error) {
    resp.send(Response.error(error));
    return; //结束
  }

  //查询数据库 movie_actor
  let startIndex = (page - 1) * 10;
  let size = parseInt(pagesize);
  let sql = "select * from movie_actor limit ?,?";
  pool.query(sql, [startIndex, size], (err, result) => {
    if (err) {
      throw err;
    }
    //将结果封装，返回给客户端
    resp.send(Response.ok(result));
  });
});

/**通过movie_id查询演员列表接口 */
router.get("/movie-actors/movieid", (req, resp) => {
  // 获取请求参数   get请求的参数封装在req.query中
  let { movie_id } = req.query;

  //TODO 服务端表单验证  如果验证通过那么继续后续业务  如果验证不通过，则直接返回参数异常
  let schema = Joi.object({
    movie_id: Joi.string().required(), // 必填
  });
  let { error, value } = schema.validate(req.query);
  if (error) {
    resp.send(Response.error(400, error));
    return; // 结束
  }

  let sql = `select 
        ma.id actor_id,
        mima.movie_id movie_id,
        ma.actor_name actor_name,
        ma.actor_avatar actor_avatar
    from 
        movie_actor ma join movie_info_map_actor mima on ma.id = mima.actor_id
    where 
        mima.movie_id = ?`;
  pool.query(sql, [movie_id], (error, result) => {
    if (error) {
      resp.send(Response.error(500, error));
      throw error;
    }
    // 将结果封装，返回给客户端
    resp.send(Response.ok(result));
  });
});

//将router对象导出
module.exports = router;
