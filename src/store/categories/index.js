import api from "../../http/api";
import { Message } from "element-ui";
export default {
  namespaced: true,
  state: {
    pages: {
      pagenum: 1,
      pagesize: 5,
      total: 0,
    },
    categoriesList: [],
  },
  mutations: {
    getCategoriesList(state, data) {
      console.log(data.result);
      state.categoriesList = data.result;
      state.pages.pagenum = data.pagenum + 1;
      state.pages.total = data.total;
      console.log(state.pages);
    },
  },
  actions: {
    async getCategories({ commit, state }, type) {
      let res = await api.getCategories({
        pagenum: state.pages.pagenum,
        pagesize: state.pages.pagesize,
        type,
      });
      if (res.meta.status === 200) {
        commit("getCategoriesList", res.data);
      }
    },
  },
};
