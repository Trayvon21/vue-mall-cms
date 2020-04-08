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
    categoriesList: [],
    attributesList: [],
    attributesListOnly: [],
  },
  mutations: {
    //获取商品列表
    getGoodsList(state, data) {
      state.goodsList = data.goods;
      state.pages.pagenum = Number(data.pagenum);
      state.pages.total = data.total;
      console.log(state.pages);
    },
    //获取分类列表
    getCategoriesList(state, data) {
      console.log(data);
      state.categoriesList = data;
    },
    getAttributesList(state, data) {
      console.log(data);
      data.map((item) => {
        item.attr_vals = item.attr_vals.split(",");
      });
      state.attributesList = data;
    },
    getAttributesListOnly(state, data) {
      console.log(data);
      state.attributesListOnly = data;
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
    async getCategories({ commit }) {
      let res = await api.getCategories({ type: 3 });
      if (res.meta.status === 200) {
        commit("getCategoriesList", res.data);
      }
    },
    async getAttributes({ commit }, params) {
      let res = await api.getAttributes(params);
      if (res.meta.status === 200) {
        commit("getAttributesList", res.data);
      }
      params.sel = "only";
      let res2 = await api.getAttributes(params);
      if (res2.meta.status === 200) {
        commit("getAttributesListOnly", res2.data);
      }
    },
    async addGoods({ commit }, params) {
      let res = await api.addGoods(params);
      if (res.meta.status === 200) {
        Message.success(res.meta.msg);
        router.push("/goods/goods");
      }
    },
    async delGood({ dispatch }, gid) {
      let res = await api.delGood(gid);
      if (res.meta.status === 200) {
        dispatch("getGoods", "");
      }
    },
  },
};
