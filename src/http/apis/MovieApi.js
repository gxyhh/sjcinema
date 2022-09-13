import myAxios from "../MyAxios";
import BASEURL from "../BaseUrl.js";
const actorApi = {
  /**添加电影 */
  add(params) {
    return myAxios.post(BASEURL + "/movie-info/add", params);
  },
  /**查询电影类别 */
  listAllMovieType() {
    return myAxios.get(BASEURL + "/movie-types");
  },
  /**查询所有电影 */
  list(params) {
    return myAxios.get(BASEURL + "/movie-infos", params);
  },
  del(params) {
    return myAxios.post(BASEURL + "/movie-info/del", params);
  },
  /**通过id查询电影 */
  queryById(params) {
    return myAxios.get(BASEURL + "/movie-info/query", params);
  },
  /**添加电影 */
  update(params) {
    return myAxios.post(BASEURL + "/movie-info/update", params);
  },
  /**为电影绑定演员列表 */
  bindActors(params) {
    return myAxios.post(BASEURL + "/movie-info/bind-actors", params);
  },
  /**通过电影名称模糊查询所有电影 */
  listByName(params) {
    return myAxios.post(BASEURL + "/movie-infos/name", params);
  },
};

export default actorApi;
