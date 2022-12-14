import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userInfo: JSON.parse(localStorage.getItem("user")), //用于存储当前用户信息
    token: localStorage.getItem("token"), //存储token字符串
  },
  getters: {},
  mutations: {
    /**登录成功后将会获取用户信息与token字符串，调用savaUserState将这些信息存入state*/
    saveUserState(state, payload) {
      state.user = payload.user;
      state.token = payload.token;
      //存入localstorage
      localStorage.setItem("token", payload.token);
      localStorage.setItem("user", JSON.stringify(payload.user));
    },
    /**清空用户状态 */
    clearUserState(state) {
      state.user = undefined;
      state.token = undefined;
      localStorage.clear();
    },
  },
  actions: {},
  modules: {},
});
