import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./filters";
//引入element-ui
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);

import ZkTable from "vue-table-with-tree-grid";
Vue.use(ZkTable);

//引入总线程传值
import "./bus";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
