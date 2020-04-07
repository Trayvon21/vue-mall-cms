import api from "../../http/api";
import router from "../../router/";
import { Message } from "element-ui";
export default {
  namespaced: true,
  state: {
    pages: {
      pagenum: 1,
      pagesize: 10,
      total: 0,
    },
    goodsList: [],
  },
  mutations: {
    getGoodsList(state, data) {
      state.goodsList = data.goods;
      state.pages.pagenum = Number(data.pagenum);
      state.pages.total = data.total;
      console.log(state.pages);
    },
  },
  actions: {
    async getGoods({ commit, state }, query) {
      let res = await api.getGoods({
        pagenum: state.pages.pagenum,
        pagesize: state.pages.pagesize,
        query,
      });
      if (res.meta.status === 200) {
        commit("getGoodsList", res.data);
      }
    },
  },
};
