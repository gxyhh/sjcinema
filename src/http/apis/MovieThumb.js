import myAxios from "../MyAxios";
import BASEURL from "../BaseUrl.js";
const actorApi = {
  /**添加剧照 */
  add(params) {
    return myAxios.post(BASEURL + "/movie-thumb/add", params);
  },
  /**删除剧照 */
del(params){
  return myAxios.post(BASEURL + "/movie-thumb/del", params)
},
/**通过相应电影id查询所有剧照 */
listByMovieId(params){
    return myAxios.get(BASEURL+'/movie-thumbs/movieid', params)
  },

};


export default actorApi;
