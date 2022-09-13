import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

//引入elementUI
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);

//引入axios
// 配置axios
import axios from "axios";
axios.defaults.baseURL = "http://localhost:3000/";
Vue.prototype.axios = axios;

// 引入httpApis;
import httpApis from "./http/index";
Vue.prototype.$http = httpApis;


// 设置jscode安全密钥
window._AMapSecurityConfig = {
  securityJsCode: "78c1731ba6f00088287356a0755c958c",
};



Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
