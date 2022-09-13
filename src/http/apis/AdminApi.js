import axios from "axios";
import qs from "qs";
import myAxios from "../MyAxios";
import BASEURL from "../BaseUrl.js";
const instance = axios.create();
const adminApi = {
  /**登录 */
  login(params) {
    return myAxios.post(BASEURL + "/user/login", params);
  },
};

export default adminApi;
