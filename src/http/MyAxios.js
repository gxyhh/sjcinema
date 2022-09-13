import axios from "axios";
import qs from "qs";
axios.defaults.baseURL = "http://localhost:3000/";
const instance = axios.create();
import store from "../store";

/**添加请求拦截器 */
instance.interceptors.request.use((config) => {
  //从vuex中获取token，如果有，则设置header一起发送请求
  let token = store.state.token;
  if (token) {
    config.headers.authorization = token;
  }
  return config;
});

/**添加响应拦截器 */
instance.interceptors.response.use((response) => {
  if (response.data.code == 401) {
    //用户token失效
    window.location = "/user/login";
  } else {
    return response;
  }
});

const myAxios = {
  //发送get请求
  get(url, params) {
    return instance({
      method: "get",
      url: url, //请求资源路径
      params: params, //请求参数对象 {参数名：参数值...}
    });
  },
  //发送post请求
  post(url, params) {
    return instance({
      method: "post",
      url: url,
      data: qs.stringify(params),
    });
  },
};
export default myAxios;
