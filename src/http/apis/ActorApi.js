import axios from "axios";
import qs from "qs";
import myAxios from "../MyAxios";
import BASEURL from "../BaseUrl.js";
const instance = axios.create();
const actorApi = {
  /**通过id删除演员接口 */
  delete(params) {
    return myAxios.post(BASEURL + "/movie-actor/del", params);
  },
  /**添加演员 */
  add(params) {
    return myAxios.post(BASEURL + "/movie-actor/add", params);
  },

  /**查询演员接口 */
  list(params) {
    return myAxios.get(BASEURL + "/movie-actors", params);
  },
  /**通过姓名模糊查询演员列表 */
  listByName(params) {
    return myAxios.post(BASEURL + "/movie-actors/name", params);
  },
  /**通过movieId查询演员列表 */
  listByMovieId(params) {
    return myAxios.get(BASEURL + "/movie-actors/movieid", params);
  },
};

export default actorApi;
