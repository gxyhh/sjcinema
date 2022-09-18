const express = require("express");
const app = express();
const port = 3000; //服务端口
const Response = require("./utils/Response.js");

//配置跨域
const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);

//解析post请求参数
app.use(
  express.urlencoded({
    extended: true,
  })
);
const jwt = require("jsonwebtoken");
const { request } = require("express");
//自定义token全局验证中间件
const tokenTools = function (req, resp, next) {
  //若请求路径是/user/login，则不拦截，直接向后执行
  if (req.path == "/user/login") {
    next();
    return;
  }

  //执行token验证
  let token = req.headers["authorization"];
  try {
    //密钥解密
    let payload = jwt.verify(token, "JWT_SECRET_KEY");
    req.tokenPayload = payload; //将token中存储的数据直接赋值给req，在后续业务中可使用req.tokenpayload获取这些信息
  } catch (error) {
    resp.send(Response.error(401, "用户验证失败，请重新登陆"));
    return;
  }
  next(); //继续后续
};
app.use(tokenTools);

//引入外部路由
app.use(require("./router/MovieActor.js"));
app.use(require("./router/MovieDirector.js"));
app.use(require("./router/MovieInfo.js"));
app.use(require("./router/MovieThumb.js"));
app.use(require("./router/Cinema.js"));
app.use(require("./router/CinemaRoom.js"));
app.use(require("./router/ShowingonPlan.js"));
app.use(require("./router/Admin.js"));

/**
 * 接口处理请求
 */
app.get("/", (req, resp) => {
  resp.send("hello");
});

app.listen(port, () => {
  console.log("世纪影城后端服务已启动...");
});
