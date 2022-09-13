import axios from "axios";
import qs from "qs";
import myAxios from "../MyAxios";
import BASEURL from "../BaseUrl.js";
const instance = axios.create();
const directorApi = {
  /**通过id删除导演接口 */
  delete(params) {
    return myAxios.post(BASEURL + "/movie-director/del", params);
  },
  /**添加导演 */
  add(params) {
    console.log("添加导演接口参数", params);
    return myAxios.post(BASEURL + "/movie-director/add", params);
  },

  /**查询导演接口 */
  list(params) {
    return myAxios.get(BASEURL + "/movie-directors", params);
  },
  /**通过姓名模糊查询导演列表 */
  listByName(params) {
    return myAxios.post(BASEURL + "/movie-directors/name", params);
  },
};

export default directorApi;
