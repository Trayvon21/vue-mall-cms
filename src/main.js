import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
//引入dayjs
import dayjs from "dayjs";
Vue.prototype.$dayjs = dayjs;
//引入element-ui
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);

//引入总线程传值
import "./bus";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
