import Vue from "vue";
import Vuex from "vuex";
import user from "./user";
import right from "./right";
import order from "./order";
import goods from "./goods";
import categories from "./categories";
import api from "../http/api";
Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    chartData: null,
  },
  mutations: {},
  actions: {
    async getChartData({ state }) {
      let res = await api.getChart();
      if (res.meta.status === 200) {
        state.chartData = res.data;
        console.log(res.data);
      }
    },
  },
  getters: {},
  modules: {
    user,
    right,
    order,
    goods,
    categories,
  },
});
