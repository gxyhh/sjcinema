import myAxios from "../MyAxios";
import BASEURL from "../BaseUrl.js";
const cinemaApi = {
  /**添加影院 */
  add(params) {
    return myAxios.post(BASEURL + "/cinema/add", params);
  },
  /**删除影院 */
  delete(params) {
    return myAxios.post(BASEURL + "/cinema/del", params);
  },
  /** 查询所有影院标签*/
  queryAllTags() {
    return myAxios.get(BASEURL + "/cinema/tags");
  },
  /**查询所有电影院 */
  list() {
    return myAxios.get(BASEURL + "/cinemas");
  },
  /**通过id查询电影院 */
  queryById(params) {
    return myAxios.get(BASEURL + "/cinema/query", params);
  },
  /**更新电影院 */
  update(params) {
    return myAxios.post(BASEURL + "/cinema/update", params);
  },
};

export default cinemaApi;
